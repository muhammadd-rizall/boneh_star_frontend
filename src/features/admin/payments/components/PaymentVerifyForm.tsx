import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { DialogFooter } from "@/components/ui/Dialog";
import { CheckCircle, XCircle, Save, AlignLeft, ShieldCheck } from "lucide-react";
import type { Payment, PaymentVerifyData } from "../types/Payment";
import { paymentService } from "../services/PaymentService";

interface PaymentVerifyFormProps {
  payment: Payment;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentVerifyForm({ payment, onSuccess, onCancel }: PaymentVerifyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'verified' | 'rejected'>('verified');
  const [rejectionReason, setRejectionReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data: PaymentVerifyData = {
        status,
        rejection_reason: status === 'rejected' ? rejectionReason : undefined,
      };
      await paymentService.verify(payment.id, data);
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat memproses data.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-2">
          <XCircle size={16} className="text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Rincian Pembayaran Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-3">
            <ShieldCheck size={16} className="text-action-blue shrink-0" />
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Rincian Verifikasi Transaksi</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama Penyewa</span>
              <span className="text-sm font-black text-midnight-indigo mt-0.5">{payment.transaction?.booking?.customer?.name || "N/A"}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nomor Invoice</span>
              <span className="text-sm font-semibold text-midnight-indigo mt-0.5">{payment.transaction?.invoice_number || "N/A"}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jumlah Bayar</span>
              <span className="text-sm font-black text-emerald-600 mt-0.5">
                Rp {new Intl.NumberFormat('id-ID').format(payment.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Keputusan Verifikasi */}
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Keputusan Verifikasi</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setStatus('verified')}
              className={`flex items-center justify-center gap-2.5 rounded-xl border-2 py-3.5 text-sm font-bold transition-all cursor-pointer ${
                status === 'verified' 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm scale-[1.01]" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/20"
              }`}
            >
              <CheckCircle size={18} strokeWidth={2.5} />
              Setujui & Verifikasi
            </button>
            <button
              type="button"
              onClick={() => setStatus('rejected')}
              className={`flex items-center justify-center gap-2.5 rounded-xl border-2 py-3.5 text-sm font-bold transition-all cursor-pointer ${
                status === 'rejected' 
                  ? "border-red-500 bg-red-50 text-red-700 shadow-sm scale-[1.01]" 
                  : "border-slate-200 bg-white text-slate-600 hover:border-red-300 hover:bg-red-50/20"
              }`}
            >
              <XCircle size={18} strokeWidth={2.5} />
              Tolak Pembayaran
            </button>
          </div>
        </div>

        {status === 'rejected' && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-300">
            <Textarea
              label="Alasan Penolakan"
              placeholder="Jelaskan alasan pembayaran ini ditolak (misal: nominal tidak sesuai, bukti tidak terbaca)..."
              icon={AlignLeft}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              rows={3}
            />
          </div>
        )}
      </div>

      <DialogFooter className="mt-4 border-t border-slate-200 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={loading}
          className="rounded-xl font-bold"
        >
          Batal
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          loading={loading} 
          disabled={loading}
          icon={Save}
          className="rounded-xl font-bold shadow-button"
        >
          Simpan Keputusan
        </Button>
      </DialogFooter>
    </form>
  );
}
