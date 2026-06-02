import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { User, Save, Phone, MapPin, Image as ImageIcon, Info, X, Camera, StickyNote } from "lucide-react";
import type { Driver } from "../types/Driver";
import { driverService } from "../services/DriverService";

interface DriverFormProps {
  driver?: Driver | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DriverForm({ driver, onSuccess, onCancel }: DriverFormProps) {
  const isEdit = !!driver;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    status: "available",
    notes: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name,
        phone: driver.phone,
        address: driver.address,
        status: driver.status,
        notes: driver.notes || "",
      });
      if (driver.photo) {
        setPhotoPreview(driver.photo);
      }
    }
  }, [driver]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("address", formData.address);
      data.append("status", formData.status);
      data.append("notes", formData.notes);
      
      if (photoFile) {
        data.append("photo", photoFile);
      }

      if (isEdit && driver) {
        await driverService.update(driver.id, data);
      } else {
        await driverService.create(data);
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
          {error}
        </div>
      )}

      <div className="flex flex-col items-center gap-4 mb-2">
        <div className="relative group">
          <div className="h-32 w-32 rounded-[32px] border-2 border-dashed border-platinum-tint bg-cloud-mist flex items-center justify-center overflow-hidden transition-all group-hover:border-action-blue group-hover:bg-cloud-mist/50 shadow-sm">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-blue opacity-50">
                <Camera size={32} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em]">Foto</span>
              </div>
            )}
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="absolute -bottom-2 -right-2 flex gap-2">
            {photoPreview && (
              <button
                type="button"
                onClick={removePhoto}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg transition-all hover:bg-red-600 hover:scale-105 active:scale-95 border-4 border-white"
              >
                <X size={18} strokeWidth={3} />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-action-blue text-white shadow-lg transition-all hover:bg-glacier-blue hover:scale-105 active:scale-95 border-4 border-white"
            >
              <ImageIcon size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-blue font-medium opacity-60">
          Format: JPG, PNG. Maksimal 2MB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nama Lengkap"
          placeholder="Contoh: Budi Santoso"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Input
          label="Nomor Telepon"
          placeholder="Contoh: 08123456789"
          icon={Phone}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Alamat Lengkap"
            placeholder="Masukkan alamat domisili supir"
            icon={MapPin}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Select
            label="Status Operasional"
            icon={Info}
            value={formData.status}
            onChange={(value) => setFormData({ ...formData, status: value as any })}
            options={[
              { value: "available", label: "Tersedia" },
              { value: "on_duty", label: "Bertugas" },
              { value: "inactive", label: "Nonaktif" },
            ]}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Catatan Supir"
            placeholder="Informasi tambahan mengenai supir ini..."
            icon={StickyNote}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
          />
        </div>
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo">Batal</Button>
        <Button type="submit" variant="primary" className="flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Simpan Perubahan" : "Daftarkan Supir"}
        </Button>
      </DialogFooter>
    </form>
  );
}
