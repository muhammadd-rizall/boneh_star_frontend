import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import { CheckCircle, XCircle, Save, AlignLeft } from "lucide-react";
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
      const errorMessage = err.response?.data?.message || err.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Payment Details</div>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-500">Invoice</div>
              <div className="text-sm font-medium text-slate-800">{payment.transaction?.invoice_number}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Amount</div>
              <div className="text-sm font-bold text-slate-800">
                Rp {new Intl.NumberFormat('id-ID').format(payment.amount)}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Verification Decision</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setStatus('verified')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                status === 'verified' 
                  ? "border-green-600 bg-green-50 text-green-700" 
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              <CheckCircle size={18} />
              Verify
            </button>
            <button
              type="button"
              onClick={() => setStatus('rejected')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                status === 'rejected' 
                  ? "border-red-600 bg-red-50 text-red-700" 
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              <XCircle size={18} />
              Reject
            </button>
          </div>
        </div>

        {status === 'rejected' && (
          <Textarea
            label="Rejection Reason"
            placeholder="Explain why this payment is being rejected..."
            icon={AlignLeft}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
            rows={3}
          />
        )}
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          Confirm Decision
        </Button>
      </div>
    </form>
  );
}
