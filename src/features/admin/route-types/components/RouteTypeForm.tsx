import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { Map, Save, AlignLeft, Globe, XCircle } from "lucide-react";
import type { RouteType, RouteTypeFormData } from "../types/RouteType";
import { routeTypeService } from "../services/RouteTypeService";

interface RouteTypeFormProps {
  routeType?: RouteType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RouteTypeForm({ routeType, onSuccess, onCancel }: RouteTypeFormProps) {
  const isEdit = !!routeType;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RouteTypeFormData>({
    name: "",
    scope: "inside",
    description: "",
  });

  useEffect(() => {
    if (routeType) {
      setFormData({
        name: routeType.name,
        scope: routeType.scope,
        description: routeType.description,
      });
    }
  }, [routeType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && routeType) {
        await routeTypeService.update(routeType.id, formData);
      } else {
        await routeTypeService.create(formData);
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
          label="Nama Jenis Rute"
          placeholder="Contoh: Dalam Kota, Luar Kota"
          icon={Map}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Select
          label="Cakupan Wilayah"
          icon={Globe}
          value={formData.scope}
          onChange={(value) => setFormData({ ...formData, scope: value as 'inside' | 'outside' })}
          options={[
            { value: "inside", label: "Dalam Kota" },
            { value: "outside", label: "Luar Kota" },
          ]}
          required
        />
        
        <Textarea
          label="Deskripsi (Opsional)"
          placeholder="Jelaskan karakteristik jenis rute ini..."
          icon={AlignLeft}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={5}
        />
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo">Batal</Button>
        <Button type="submit" variant="primary" className="flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Simpan Perubahan" : "Tambah Jenis Rute"}
        </Button>
      </DialogFooter>
    </form>
  );
}
