import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { CreditCard, Save, User, Hash, CheckCircle2, XCircle, ClipboardList } from "lucide-react";
import type { PaymentMethod, PaymentMethodFormData } from "../types/PaymentMethod";
import { paymentMethodService } from "../services/PaymentMethodService";
import { cn } from "@/lib/utils";

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
      const errorMessage = err.response?.data?.message || err.message || "Terjadi kesalahan saat menyimpan data.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <XCircle size={18} className="text-red-500" />
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
            <ClipboardList size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Informasi Rekening</h3>
            <p className="text-xs font-medium text-slate-blue opacity-70">Detail tujuan pembayaran untuk pelanggan</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Nama Bank / Platform"
            placeholder="Contoh: BCA, Mandiri, Dana"
            icon={CreditCard}
            value={formData.bank_name}
            onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
            required
          />
          
          <Input
            label="Nomor Rekening"
            placeholder="Masukkan nomor rekening atau ID wallet"
            icon={Hash}
            value={formData.account_number}
            onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Nama Pemilik Rekening"
              placeholder="Contoh: PT Boneh Star Transport"
              icon={User}
              value={formData.account_name}
              onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <label className="text-[13px] font-bold text-midnight-indigo ml-1 uppercase tracking-wider opacity-90">Status Akun</label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_active: true })}
              className={cn(
                "flex flex-1 items-center justify-center gap-3 rounded-xl border-2 py-4 text-sm font-bold transition-all",
                formData.is_active 
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm scale-[1.02]" 
                  : "border-platinum-tint/50 bg-white text-slate-blue hover:border-action-blue/30"
              )}
            >
              <CheckCircle2 size={20} strokeWidth={2.5} />
              Aktif
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, is_active: false })}
              className={cn(
                "flex flex-1 items-center justify-center gap-3 rounded-xl border-2 py-4 text-sm font-bold transition-all",
                !formData.is_active 
                  ? "border-red-500 bg-red-50 text-red-700 shadow-sm scale-[1.02]" 
                  : "border-platinum-tint/50 bg-white text-slate-blue hover:border-action-blue/30"
              )}
            >
              <XCircle size={20} strokeWidth={2.5} />
              Nonaktif
            </button>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="outline" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo h-14">Batal</Button>
        <Button type="submit" variant="primary" className="sm:flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Simpan Perubahan" : "Tambah Metode Bayar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
