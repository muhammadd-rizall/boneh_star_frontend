import React from 'react';
import type { CustomerQuotation } from '../types/Booking';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { Receipt, Info, CheckCircle2, MessageSquareText } from 'lucide-react';

interface Props {
  quotation: CustomerQuotation;
  onAccept: () => void;
  onRevise: (note: string) => void;
}

export default function QuotationSection({ quotation, onAccept, onRevise }: Props) {
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

  if (quotation.status === 'accepted') {
    return (
      <Card className="bg-emerald-50/30 border-emerald-100">
        <div className="flex items-center gap-3 text-emerald-700">
          <CheckCircle2 size={20} />
          <p className="text-sm font-bold">Penawaran harga telah Anda setujui</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <Receipt size={48} className="text-slate-50 opacity-10" />
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Total Penawaran</p>
            <h3 className="text-3xl font-black text-slate-900">{formatCurrency(quotation.proposed_price)}</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Uang Muka (DP): <span className="text-slate-900 font-bold">{formatCurrency(quotation.dp_amount)}</span>
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Info size={16} className="mt-0.5 text-slate-400" />
              <div>
                <p className="text-xs font-bold text-slate-700">Catatan Admin:</p>
                <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 italic">
                  "{quotation.note_to_customer}"
                </p>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-3">
              <p className="text-[10px] font-bold text-slate-400">BERLAKU HINGGA: {formatDate(quotation.valid_until)}</p>
            </div>
          </div>

          {quotation.status === 'sent' && !isRevising && (
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={onAccept} className="flex-1" icon={CheckCircle2}>
                Setujui Harga
              </Button>
              <Button variant="ghost" onClick={() => setIsRevising(true)} className="flex-1" icon={MessageSquareText}>
                Minta Revisi
              </Button>
            </div>
          )}

          {isRevising && (
            <div className="flex flex-col gap-4 border-t border-slate-100 pt-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Alasan Revisi / Tawaran Anda:</label>
                <textarea
                  className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  rows={3}
                  placeholder="Contoh: Apakah bisa kurang harganya karena rutenya tidak terlalu jauh?"
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRevise} loading={loading} size="sm" className="flex-1">Kirim Revisi</Button>
                <Button variant="ghost" onClick={() => setIsRevising(false)} size="sm" disabled={loading}>Batal</Button>
              </div>
            </div>
          )}

          {quotation.status === 'revision' && (
            <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
              <p className="text-xs font-medium text-violet-700">
                <span className="font-bold">Menunggu Revisi:</span> Permintaan revisi Anda telah dikirim. Admin akan segera meninjau kembali penawaran ini.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
