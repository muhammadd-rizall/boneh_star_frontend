import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { DialogFooter } from "@/components/ui/Dialog";
import { CheckCircle, XCircle, Save, AlignLeft, Info } from "lucide-react";
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <XCircle size={18} className="text-red-500" />
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="rounded-[24px] border border-platinum-tint bg-cloud-mist/30 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-platinum-tint/50 pb-3">
            <Info size={16} className="text-action-blue" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-steel-gray">Rincian Pembayaran</span>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-blue opacity-60 mb-1">Nomor Invoice</div>
              <div className="text-base font-semibold text-midnight-indigo">{payment.transaction?.invoice_number}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-blue opacity-60 mb-1">Jumlah Bayar</div>
              <div className="text-lg font-bold text-midnight-indigo">
                Rp {new Intl.NumberFormat('id-ID').format(payment.amount)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-[13px] font-semibold text-midnight-indigo ml-1 uppercase tracking-wider opacity-90">Keputusan Verifikasi</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setStatus('verified')}
              className={`flex flex-1 items-center justify-center gap-3 rounded-xl border-2 py-4 text-sm font-semibold transition-all ${
                status === 'verified' 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm scale-[1.02]" 
                  : "border-platinum-tint/50 bg-white text-slate-blue hover:border-action-blue/30"
              }`}
            >
              <CheckCircle size={20} strokeWidth={2.5} />
              Verifikasi
            </button>
            <button
              type="button"
              onClick={() => setStatus('rejected')}
              className={`flex flex-1 items-center justify-center gap-3 rounded-xl border-2 py-4 text-sm font-semibold transition-all ${
                status === 'rejected' 
                  ? "border-red-500 bg-red-50 text-red-700 shadow-sm scale-[1.02]" 
                  : "border-platinum-tint/50 bg-white text-slate-blue hover:border-action-blue/30"
              }`}
            >
              <XCircle size={20} strokeWidth={2.5} />
              Tolak
            </button>
          </div>
        </div>

        {status === 'rejected' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <Textarea
              label="Alasan Penolakan"
              placeholder="Jelaskan mengapa pembayaran ini ditolak..."
              icon={AlignLeft}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              rows={4}
            />
          </div>
        )}
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10 font-semibold text-slate-blue hover:text-midnight-indigo">Batal</Button>
        <Button type="submit" variant="primary" className="flex-1 font-semibold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          Konfirmasi Keputusan
        </Button>
      </DialogFooter>
    </form>
  );
}
