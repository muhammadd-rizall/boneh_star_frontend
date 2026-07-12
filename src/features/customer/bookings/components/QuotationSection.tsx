import React from 'react';
import type { CustomerQuotation } from '../types/Booking';
import { formatCurrency, formatDate } from '@/utils/formatter';
import {
  CheckCircle2, MessageSquareText, MessageCircle,
  Clock, Calendar, Info, XCircle, Send
} from 'lucide-react';

interface Props {
  quotation: CustomerQuotation;
  whatsappNumber?: string;
  bookingCode: string;
  onAccept: () => void;
  onRevise: (note: string) => void;
}

export default function QuotationSection({
  quotation, whatsappNumber, bookingCode, onAccept, onRevise,
}: Props) {
  const [isRevising, setIsRevising] = React.useState(false);
  const [proposedPrice, setProposedPrice] = React.useState('');
  const [revisionNote, setRevisionNote] = React.useState('');
  const [acceptLoading, setAcceptLoading] = React.useState(false);
  const [reviseLoading, setReviseLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const parseRevisionNote = (note: string | null | undefined) => {
    if (!note) return null;
    try {
      const parsed = JSON.parse(note);
      if (parsed && typeof parsed === 'object' && ('proposed_price' in parsed || 'note' in parsed)) {
        return parsed as { proposed_price?: number; note?: string };
      }
    } catch (e) {
      // Fallback to plain text
    }
    return { note };
  };

  const handleAccept = async () => {
    setError(null);
    setAcceptLoading(true);
    try { 
      await onAccept(); 
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal menyetujui penawaran. Silakan coba lagi.');
    } finally { 
      setAcceptLoading(false); 
    }
  };

  const handleRevise = async () => {
    if (!revisionNote.trim() || !proposedPrice.trim()) return;
    setError(null);
    setReviseLoading(true);
    try {
      const payload = JSON.stringify({
        proposed_price: Number(proposedPrice),
        note: revisionNote
      });
      await onRevise(payload);
      setIsRevising(false);
      setRevisionNote('');
      setProposedPrice('');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Gagal mengirim permintaan negosiasi. Silakan coba lagi.');
    } finally { 
      setReviseLoading(false); 
    }
  };

  const handleWhatsApp = () => {
    if (!whatsappNumber) return;
    const msg = `Halo Admin Boneh Star, saya ingin bernegosiasi mengenai penawaran harga untuk Booking #${bookingCode}.`;
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ── Tampilan harga (selalu tampil) ──────────────────────────────────────────
  const PriceCard = () => {
    const hasDiscount = Number(quotation.proposed_price) !== Number(quotation.initial_price) && Number(quotation.initial_price) > 0;
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl bg-cloud-mist border border-pale-gray">
        <div className="flex-1">
          {hasDiscount && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-steel-gray">Harga Awal:</span>
              <span className="text-xs font-bold text-steel-gray line-through">{formatCurrency(quotation.initial_price)}</span>
            </div>
          )}
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-steel-gray mb-1">
            {hasDiscount ? 'Harga Kesepakatan / Penawaran Baru' : 'Total Biaya Penawaran'}
          </p>
          <p className="text-3xl font-black text-midnight-indigo">{formatCurrency(quotation.proposed_price)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-blue">DP (Uang Muka):</span>
            <span className="text-sm font-black text-action-blue">{formatCurrency(quotation.dp_amount)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-steel-gray border-t sm:border-t-0 sm:border-l border-pale-gray pt-3 sm:pt-0 sm:pl-4">
          <Calendar size={13} />
          <span className="font-semibold">Berlaku hingga {formatDate(quotation.valid_until)}</span>
        </div>
      </div>
    );
  };

  // ── Catatan admin ───────────────────────────────────────────────────────────
  const AdminNote = () => quotation.note_to_customer ? (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-platinum-tint bg-white">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cloud-mist">
        <Info size={13} className="text-slate-blue" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.12em] text-steel-gray mb-1">Catatan dari Admin</p>
        <p className="text-sm text-midnight-indigo font-medium leading-relaxed">{quotation.note_to_customer}</p>
      </div>
    </div>
  ) : null;

  // ── STATUS: accepted ────────────────────────────────────────────────────────
  if (quotation.status === 'accepted') {
    return (
      <div className="flex flex-col gap-4">
        <PriceCard />
        <AdminNote />
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500">
            <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800">Penawaran telah disetujui</p>
            <p className="text-xs text-emerald-600 mt-0.5">Silakan lanjutkan ke tahap pembayaran di bawah.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── STATUS: revision (menunggu revisi admin) ────────────────────────────────
  if (quotation.status === 'revision') {
    const parsed = parseRevisionNote(quotation.revision_note);
    return (
      <div className="flex flex-col gap-4">
        <PriceCard />
        <AdminNote />

        <div className="flex items-start gap-3 p-4 rounded-xl bg-action-blue/5 border border-action-blue/20">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-action-blue/10">
            <Clock size={16} className="text-action-blue" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold text-midnight-indigo">Dalam Proses Negosiasi</p>
            <p className="text-xs text-slate-blue mt-0.5 leading-relaxed">
              Pengajuan tawaran harga Anda telah terkirim dan sedang ditinjau oleh pihak admin Boneh Star.
            </p>
          </div>
        </div>

        {parsed && (
          <div className="p-4 rounded-xl bg-cloud-mist border border-pale-gray flex flex-col gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-steel-gray border-b border-pale-gray pb-2">
              Detail Pengajuan Negosiasi Anda
            </p>
            {parsed.proposed_price ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-blue">Harga yang Anda Tawar:</span>
                <span className="text-sm font-black text-action-blue">{formatCurrency(parsed.proposed_price)}</span>
              </div>
            ) : null}
            {parsed.note ? (
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-steel-gray">Pesan Pendukung / Alasan:</span>
                <p className="text-xs text-midnight-indigo font-semibold italic">"{parsed.note}"</p>
              </div>
            ) : null}
          </div>
        )}

        {whatsappNumber && (
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-colors cursor-pointer shadow-sm"
          >
            <MessageCircle size={16} />
            Hubungi Admin via WhatsApp
          </button>
        )}
      </div>
    );
  }

  // ── STATUS: sent (menunggu keputusan customer) ──────────────────────────────
  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50 text-xs font-semibold text-rose-700 flex items-center gap-2">
          <XCircle size={14} className="text-rose-500 shrink-0" strokeWidth={2.5} />
          <span>{error}</span>
        </div>
      )}
      <PriceCard />
      <AdminNote />

      {/* Form revisi (slide in) */}
      {isRevising ? (
        <div className="flex flex-col gap-4 p-5 rounded-xl border border-platinum-tint bg-white animate-in slide-in-from-top-2 duration-200">
          <div className="border-b border-pale-gray pb-3 mb-1">
            <h4 className="text-sm font-black text-midnight-indigo">Negosiasi Penawaran Harga</h4>
            <p className="text-[10px] font-bold text-slate-blue mt-1 leading-normal">
              Masukkan harga penawaran yang Anda inginkan beserta catatan pendukung untuk admin.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">
              Harga Tawaran Anda (Rp)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-blue">Rp</span>
              <input
                type="number"
                className="w-full rounded-xl border border-pale-gray bg-cloud-mist py-2.5 pl-9 pr-4 text-xs font-bold text-midnight-indigo focus:border-action-blue focus:bg-white focus:ring-2 focus:ring-action-blue/10 outline-none transition-all"
                placeholder="Contoh: 5500000"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">
              Catatan Negosiasi / Alasan
            </label>
            <textarea
              className="w-full rounded-xl border border-pale-gray bg-cloud-mist p-3 text-xs font-medium text-midnight-indigo focus:border-action-blue focus:bg-white focus:ring-2 focus:ring-action-blue/10 outline-none transition-all resize-none"
              rows={3}
              placeholder="Jelaskan alasan atau penawaran Anda (misal: penyesuaian budget, pengurangan armada, dll)..."
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2.5 mt-1">
            <button
              onClick={handleRevise}
              disabled={reviseLoading || !revisionNote.trim() || !proposedPrice.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-action-blue hover:bg-glacier-blue text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-action-blue/10"
            >
              {reviseLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : <Send size={13} />}
              Kirim Negosiasi
            </button>
            <button
              onClick={() => { setIsRevising(false); setRevisionNote(''); setProposedPrice(''); }}
              disabled={reviseLoading}
              className="flex-1 px-4 py-3 rounded-xl border border-pale-gray text-xs font-bold text-slate-blue hover:text-midnight-indigo hover:border-steel-gray transition-colors cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        /* Tombol aksi utama */
        <div className="flex flex-col gap-3">
          {/* Setujui */}
          <button
            onClick={handleAccept}
            disabled={acceptLoading}
            className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 rounded-xl bg-action-blue hover:bg-glacier-blue text-white text-sm font-black transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-action-blue/20"
          >
            {acceptLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : <CheckCircle2 size={18} strokeWidth={2.5} />}
            Setujui Penawaran Harga
          </button>

          <div className="flex gap-2">
            {/* Minta Revisi */}
            <button
              onClick={() => setIsRevising(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-platinum-tint bg-white hover:border-steel-gray hover:bg-cloud-mist text-sm font-semibold text-slate-blue hover:text-midnight-indigo transition-all cursor-pointer"
            >
              <MessageSquareText size={15} />
              Ajukan Negosiasi
            </button>

            {/* WhatsApp */}
            {whatsappNumber && (
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-sm font-semibold text-emerald-700 transition-all cursor-pointer"
              >
                <MessageCircle size={15} />
                WhatsApp
              </button>
            )}
          </div>

          <p className="text-center text-[11px] text-steel-gray">
            Penawaran berlaku hingga <span className="font-bold text-midnight-indigo">{formatDate(quotation.valid_until)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
