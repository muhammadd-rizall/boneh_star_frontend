import React from 'react';
import type { CustomerQuotation } from '../types/Booking';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { Receipt, Info, CheckCircle2, MessageSquareText, Calendar, Clock, MessageCircle } from 'lucide-react';

interface Props {
  quotation: CustomerQuotation;
  whatsappNumber?: string;
  bookingCode: string;
  onAccept: () => void;
  onRevise: (note: string) => void;
}

export default function QuotationSection({ quotation, whatsappNumber, bookingCode, onAccept, onRevise }: Props) {
  const [isRevising, setIsRevising] = React.useState(false);
  const [revisionNote, setRevisionNote] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleRevise = async () => {
    if (!revisionNote.trim()) return;
    setLoading(true);
    try {
      await onRevise(revisionNote);
      setIsRevising(false);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppNegotiation = () => {
    if (!whatsappNumber) return;
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    const message = `Halo Admin Boneh Star, saya ingin bernegosiasi mengenai penawaran harga untuk Booking #${bookingCode}.`;
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (quotation.status === 'accepted') {
    return (
      <Card className="bg-emerald-50/20 border-emerald-100 shadow-none rounded-3xl">
        <div className="flex items-center gap-4 text-emerald-600 p-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100/50">
            <CheckCircle2 size={20} strokeWidth={2.5} />
          </div>
          <p className="text-sm font-bold">Penawaran harga telah Anda setujui. Silakan lanjutkan ke tahap pembayaran.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="relative overflow-hidden border-none shadow-xl shadow-slate-100/50">
        <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-slate-50 flex items-center justify-center -rotate-12 opacity-50">
          <Receipt size={40} className="text-slate-200" />
        </div>
        
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Estimasi Total Biaya</p>
            <h3 className="text-4xl font-black tracking-tighter text-slate-950">{formatCurrency(quotation.proposed_price)}</h3>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Uang Muka (DP):</span>
              <span className="text-sm font-black text-orange-600">{formatCurrency(quotation.dp_amount)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-3xl bg-slate-50 p-6 border border-slate-100/50">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-slate-400">
                <Info size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Catatan Admin</p>
                <p className="text-sm font-bold leading-relaxed text-slate-600 italic">
                  "{quotation.note_to_customer}"
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-slate-200/50 pt-4">
              <Calendar size={14} className="text-slate-400" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">Berlaku hingga {formatDate(quotation.valid_until)}</p>
            </div>
          </div>

          {quotation.status === 'sent' && !isRevising && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={onAccept} className="flex-1 shadow-lg shadow-slate-200" icon={CheckCircle2}>
                  Setujui Harga
                </Button>
                <Button variant="ghost" onClick={() => setIsRevising(true)} className="flex-1 font-bold" icon={MessageSquareText}>
                  Minta Revisi
                </Button>
              </div>
              
              {whatsappNumber && (
                <Button 
                  variant="outline" 
                  onClick={handleWhatsAppNegotiation} 
                  className="w-full border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold"
                  icon={MessageCircle}
                >
                  Negosiasi via WhatsApp
                </Button>
              )}
            </div>
          )}

          {isRevising && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="h-px bg-slate-100" />
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Detail Permintaan Revisi</label>
                <textarea
                  className="mt-3 w-full rounded-2xl border border-slate-100 bg-white p-4 text-sm font-semibold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all outline-none"
                  rows={4}
                  placeholder="Jelaskan kebutuhan revisi Anda atau tawaran harga yang Anda harapkan..."
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleRevise} loading={loading} size="md" className="flex-1">Kirim Revisi</Button>
                <Button variant="ghost" onClick={() => setIsRevising(false)} size="md" className="flex-1" disabled={loading}>Batal</Button>
              </div>
            </div>
          )}

          {quotation.status === 'revision' && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="rounded-2xl border border-blue-50 bg-blue-50/30 p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Clock size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-900 leading-relaxed">
                      Menunggu Revisi. Permintaan Anda telah kami terima dan sedang ditinjau oleh admin. Kami akan segera memperbarui penawaran ini.
                    </p>
                  </div>
                </div>
              </div>

              {quotation.revision_note && (
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Permintaan Anda:</p>
                  <p className="text-xs font-bold text-slate-600 italic leading-relaxed">"{quotation.revision_note}"</p>
                </div>
              )}

              {whatsappNumber && (
                <Button 
                  variant="outline" 
                  onClick={handleWhatsAppNegotiation} 
                  className="w-full border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold"
                  icon={MessageCircle}
                >
                  Follow up via WhatsApp
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
