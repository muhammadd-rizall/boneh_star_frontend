import React, { useState, useEffect, useRef } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { User, Save, Phone, MapPin, Image as ImageIcon, Info, X, Camera } from "lucide-react";
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

      <div className="flex flex-col items-center gap-4 mb-2">
        <div className="relative group">
          <div className="h-28 w-28 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-300 group-hover:bg-slate-100">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1 text-slate-400">
                <Camera size={28} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Photo</span>
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

          <div className="absolute -bottom-2 -right-2 flex gap-1">
            {photoPreview && (
              <button
                type="button"
                onClick={removePhoto}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 shadow-sm transition-all hover:bg-rose-100"
              >
                <X size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm transition-all hover:bg-indigo-100"
            >
              <ImageIcon size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium text-center">
          Format: JPG, PNG. Max 2MB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Full Name"
          placeholder="e.g. John Doe"
          icon={User}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Input
          label="Phone Number"
          placeholder="e.g. 08123456789"
          icon={Phone}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />

        <div className="md:col-span-2">
          <Input
            label="Address"
            placeholder="Complete address"
            icon={MapPin}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Select
            label="Status"
            icon={Info}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: "available", label: "Available" },
              { value: "on_duty", label: "On Duty" },
              { value: "inactive", label: "Inactive" },
            ]}
            required
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Notes"
            placeholder="Additional notes about the driver..."
            icon={Info}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
        </div>
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Driver" : "Create Driver"}
        </Button>
      </div>
    </form>
  );
}
