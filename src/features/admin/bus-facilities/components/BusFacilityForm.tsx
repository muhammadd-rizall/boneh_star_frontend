import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { Shield, Save, XCircle } from "lucide-react";
import type { BusFacility, BusFacilityFormData } from "../types/BusFacility";
import { busFacilityService } from "../services/BusFacilityService";

interface BusFacilityFormProps {
  facility?: BusFacility | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BusFacilityForm({ facility, onSuccess, onCancel }: BusFacilityFormProps) {
  const isEdit = !!facility;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BusFacilityFormData>({
    name: "",
  });

  useEffect(() => {
    if (facility) {
      setFormData({
        name: facility.name,
      });
    }
  }, [facility]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && facility) {
        await busFacilityService.update(facility.id, formData);
      } else {
        await busFacilityService.create(formData);
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
        <Input
          label="Nama Fasilitas"
          placeholder="Contoh: AC, WiFi, Toilet"
          icon={Shield}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo">Batal</Button>
        <Button type="submit" variant="primary" className="flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Simpan Fasilitas" : "Tambah Fasilitas"}
        </Button>
      </DialogFooter>
    </form>
  );
}
