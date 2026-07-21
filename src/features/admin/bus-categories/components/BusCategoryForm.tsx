import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { Layout, Users, FileText, Save, XCircle } from "lucide-react";
import type { BusCategory, BusCategoryFormData } from "../types/BusCategory";
import { busCategoryService } from "../services/BusCategoryService";
import { Textarea } from "@/components/ui/Textarea";

interface BusCategoryFormProps {
  category?: BusCategory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BusCategoryForm({ category, onSuccess, onCancel }: BusCategoryFormProps) {
  const isEdit = !!category;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BusCategoryFormData>({
    name: "",
    min_capacity: 1,
    max_capacity: 1,
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        min_capacity: category.min_capacity || 1,
        max_capacity: category.max_capacity || 1,
        description: category.description || "",
      });
    } else {
      setFormData({
        name: "",
        min_capacity: 1,
        max_capacity: 1,
        description: "",
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        if (!category?.id) {
          throw new Error("ID Kategori tidak ditemukan. Tidak dapat memperbarui data.");
        }
        await busCategoryService.update(category.id, formData);
      } else {
        await busCategoryService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Form submission error:", err);
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
          label="Nama Kategori"
          placeholder="Contoh: Big Bus, Medium Bus"
          icon={Layout}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Input
            label="Kapasitas Minimum"
            type="number"
            placeholder="Contoh: 30"
            icon={Users}
            value={formData.min_capacity.toString()}
            onChange={(e) => setFormData({ ...formData, min_capacity: Number(e.target.value) })}
            required
            min={1}
          />

          <Input
            label="Kapasitas Maksimum"
            type="number"
            placeholder="Contoh: 50"
            icon={Users}
            value={formData.max_capacity.toString()}
            onChange={(e) => setFormData({ ...formData, max_capacity: Number(e.target.value) })}
            required
            min={1}
          />
        </div>

        <Textarea
          label="Deskripsi Kategori"
          placeholder="Jelaskan karakteristik bus dalam kategori ini..."
          icon={FileText}
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo">Batal</Button>
        <Button type="submit" variant="primary" className="flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Perbarui Kategori" : "Simpan Kategori"}
        </Button>
      </DialogFooter>
    </form>
  );
}
