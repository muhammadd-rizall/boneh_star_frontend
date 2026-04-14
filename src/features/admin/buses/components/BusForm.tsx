import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Tag, Bus as BusIcon, Users, Banknote, Save, Image as ImageIcon, FileText } from "lucide-react";
import type { Bus, BusFormData } from "../types/Bus";
import { busService } from "../services/BusService";

interface BusFormProps {
  bus?: Bus | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BusForm({ bus, onSuccess, onCancel }: BusFormProps) {
  const isEdit = !!bus;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<BusFormData>({
    code: "",
    name: "",
    capacity: "",
    price_per_day: 0,
    description: "",
    is_active: true,
    image: null,
  });

  useEffect(() => {
    if (bus) {
      setFormData({
        code: bus.code,
        name: bus.name,
        capacity: bus.capacity,
        price_per_day: Number(bus.price_per_day),
        description: bus.description || "",
        is_active: bus.is_active,
        image: null, // Don't reset image unless user picks a new one
      });
      if (typeof bus.image === 'string') {
        setImagePreview(bus.image);
      }
    }
  }, [bus]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && bus) {
        await busService.update(bus.id, formData);
      } else {
        await busService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
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

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Bus Code"
          placeholder="e.g. BUS-001"
          icon={Tag}
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />

        <Input
          label="Bus Name"
          placeholder="Enter bus name"
          icon={BusIcon}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Capacity (Seats)"
          placeholder="e.g. 40"
          icon={Users}
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          required
        />

        <Input
          label="Price per Day"
          type="number"
          placeholder="e.g. 1500000"
          icon={Banknote}
          value={formData.price_per_day}
          onChange={(e) => setFormData({ ...formData, price_per_day: Number(e.target.value) })}
          required
        />
      </div>

      <div className="w-full">
        <label className="ml-1 mb-1.5 block text-sm font-medium text-slate-700">Bus Image</label>
        <div className="flex items-center gap-4">
          <div className="flex h-24 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 overflow-hidden relative group">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon size={32} />
            )}
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              accept="image/*"
              required={!isEdit}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-slate-800">Choose Image</span>
            <span className="text-xs text-slate-500">JPG, PNG or WEBP. Max 2MB.</span>
          </div>
        </div>
      </div>

      <div className="w-full">
        <label className="ml-1 mb-1.5 block text-sm font-medium text-slate-700">Description</label>
        <div className="relative group">
          <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <FileText size={18} />
          </div>
          <textarea
            className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 min-h-[100px]"
            placeholder="Enter bus description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
        <label htmlFor="is_active" className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            id="is_active"
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <span>
            <span className="block text-sm font-medium text-slate-800">Bus is active</span>
            <span className="text-sm text-slate-500">This bus will be available for booking.</span>
          </span>
        </label>
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Bus" : "Create Bus"}
        </Button>
      </div>
    </form>
  );
}
