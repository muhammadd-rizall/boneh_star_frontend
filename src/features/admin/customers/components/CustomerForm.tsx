import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { User as UserIcon, Mail, Lock, Phone, MapPin, Save, XCircle } from "lucide-react";
import type { Customer, CustomerFormData } from "../types/Customer";
import { customerService } from "../services/CustomerService";
import { Textarea } from "@/components/ui/Textarea";

interface CustomerFormProps {
  customer?: Customer | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
  const isEdit = !!customer;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    is_active: true,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || "",
        is_active: customer.is_active,
        password: "",
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = { ...formData };
      if (isEdit && !submitData.password) {
        delete submitData.password;
      }

      if (isEdit && customer) {
        await customerService.update(customer.id, submitData);
      } else {
        await customerService.create(submitData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
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

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama pelanggan"
          icon={UserIcon}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Alamat Email"
          type="email"
          placeholder="customer@contoh.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label={isEdit ? "Kata Sandi (Kosongkan jika tidak diubah)" : "Kata Sandi"}
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!isEdit}
        />

        <Input
          label="Nomor Telepon"
          placeholder="Contoh: 08123456789"
          icon={Phone}
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <Textarea
        label="Alamat Lengkap"
        placeholder="Masukkan alamat lengkap pelanggan"
        icon={MapPin}
        value={formData.address || ""}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        rows={3}
      />

      <div className="rounded-[24px] border border-platinum-tint bg-cloud-mist/30 px-6 py-6 transition-all hover:bg-cloud-mist/50">
        <label htmlFor="is_active" className="flex cursor-pointer items-start gap-4">
          <div className="relative flex items-center justify-center h-6 w-6 shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="is_active"
              className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-platinum-tint bg-white transition-all checked:bg-action-blue checked:border-action-blue focus:ring-4 focus:ring-action-blue/10"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <Save size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-midnight-indigo">Akun Aktif</span>
            <span className="text-sm font-medium text-slate-blue opacity-70">Pelanggan dapat mengakses platform dan melakukan pemesanan.</span>
          </div>
        </label>
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo">Batal</Button>
        <Button type="submit" variant="primary" className="flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Update Pelanggan" : "Daftarkan Pelanggan"}
        </Button>
      </DialogFooter>
    </form>
  );
}
