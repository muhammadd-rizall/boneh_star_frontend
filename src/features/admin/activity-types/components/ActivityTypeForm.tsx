import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { Tag, Save, AlignLeft, XCircle, ImagePlus, Trash2 } from "lucide-react";
import type { ActivityType, ActivityTypeFormData } from "../types/ActivityType";
import { activityTypeService } from "../services/ActivityTypeService";

interface ActivityTypeFormProps {
  activityType?: ActivityType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ActivityTypeForm({ activityType, onSuccess, onCancel }: ActivityTypeFormProps) {
  const isEdit = !!activityType;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ActivityTypeFormData>({
    name: "",
    description: "",
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (activityType) {
      setFormData({
        name: activityType.name,
        description: activityType.description,
      });
      if (activityType.image_url) {
        setImagePreview(activityType.image_url);
      }
    }
  }, [activityType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && activityType) {
        await activityTypeService.update(activityType.id, formData);
      } else {
        await activityTypeService.create(formData);
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
          label="Nama Jenis Aktivitas"
          placeholder="Contoh: Wisata, Antar Jemput, Charter"
          icon={Tag}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-midnight-indigo">Gambar / Ikon (Opsional)</label>
          {imagePreview ? (
            <div className="relative w-full h-[192px] rounded-xl overflow-hidden border border-platinum-tint group">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-midnight-indigo/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  icon={Trash2}
                  onClick={() => {
                    setImagePreview(null);
                    setFormData({ ...formData, image: null });
                  }}
                >
                  Hapus Gambar
                </Button>
              </div>
            </div>
          ) : (
            <Input
              type="file"
              accept="image/*"
              icon={ImagePlus}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({ ...formData, image: file });
                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
          )}
          <p className="text-xs font-medium text-slate-blue mt-1">
            Format: JPG, PNG, WEBP. Maks 5MB.
          </p>
        </div>
        
        <Textarea
          label="Deskripsi (Opsional)"
          placeholder="Jelaskan karakteristik jenis aktivitas ini..."
          icon={AlignLeft}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={5}
        />
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="outline" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo h-14">Batal</Button>
        <Button type="submit" variant="primary" className="sm:flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Simpan Perubahan" : "Tambah Aktivitas"}
        </Button>
      </DialogFooter>
    </form>
  );
}
