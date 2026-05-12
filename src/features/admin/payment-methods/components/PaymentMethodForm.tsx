import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CreditCard, Save, User, Hash, CheckCircle2, Circle } from "lucide-react";
import type { PaymentMethod, PaymentMethodFormData } from "../types/PaymentMethod";
import { paymentMethodService } from "../services/PaymentMethodService";

interface PaymentMethodFormProps {
  paymentMethod?: PaymentMethod | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PaymentMethodForm({ paymentMethod, onSuccess, onCancel }: PaymentMethodFormProps) {
  const isEdit = !!paymentMethod;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PaymentMethodFormData>({
    bank_name: "",
    account_number: "",
    account_name: "",
    is_active: true,
  });

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        bank_name: paymentMethod.bank_name,
        account_number: paymentMethod.account_number,
        account_name: paymentMethod.account_name,
        is_active: paymentMethod.is_active,
      });
    }
  }, [paymentMethod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && paymentMethod) {
        await paymentMethodService.update(paymentMethod.id, formData);
      } else {
        await paymentMethodService.create(formData);
      }
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
        <Input
          label="Bank Name"
          placeholder="e.g. BCA, Mandiri, BNI"
          icon={CreditCard}
          value={formData.bank_name}
          onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
          required
        />
        
        <Input
          label="Account Number"
          placeholder="e.g. 1234567890"
          icon={Hash}
          value={formData.account_number}
          onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
          required
        />

        <Input
          label="Account Name"
          placeholder="e.g. PT Boneh Star"
          icon={User}
          value={formData.account_name}
          onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_active: true })}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                formData.is_active 
                  ? "border-green-600 bg-green-50 text-green-700" 
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {formData.is_active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              Active
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_active: false })}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                !formData.is_active 
                  ? "border-red-600 bg-red-50 text-red-700" 
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
              }`}
            >
              {!formData.is_active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
              Inactive
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Payment Method" : "Create Payment Method"}
        </Button>
      </div>
    </form>
  );
}
