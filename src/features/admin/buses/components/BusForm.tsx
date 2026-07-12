import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Textarea } from "@/components/ui/Textarea";
import { DialogFooter } from "@/components/ui/Dialog";
import {
  Tag,
  Bus as BusIcon,
  Users,
  Save,
  Calendar,
  Hash,
  Shield,
  Info,
  Image as ImageIcon,
  CheckCircle2,
  Circle,
  Upload,
  X,
  XCircle,
  Activity,
  StickyNote,
} from "lucide-react";
import type { Bus, BusFormData } from "../types/Bus";
import { busService } from "../services/BusService";
import { busCategoryService } from "@/features/admin/bus-categories/services/BusCategoryService";
import { busFacilityService } from "@/features/admin/bus-facilities/services/BusFacilityService";
import type { BusCategory } from "@/features/admin/bus-categories/types/BusCategory";
import type { BusFacility } from "@/features/admin/bus-facilities/types/BusFacility";
import BusImageGallery from "./BusImageGallery";

interface BusFormProps {
  bus?: Bus | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface ApiError {
  response?: { data?: { message?: string } };
  message?: string;
}

type BusStatus = "available" | "booked" | "maintenance" | "inactive";

const statusConfig: Record<BusStatus, { label: string; color: string; dot: string }> = {
  available:   { label: "Tersedia",   color: "border-emerald-200 bg-emerald-50 text-emerald-700",  dot: "bg-emerald-500"  },
  booked:      { label: "Dipesan",      color: "border-blue-200   bg-blue-50   text-blue-700",       dot: "bg-blue-500"    },
  maintenance: { label: "Perawatan", color: "border-amber-200  bg-amber-50  text-amber-700",      dot: "bg-amber-500"   },
  inactive:    { label: "Nonaktif",    color: "border-slate-200  bg-slate-100 text-slate-500",      dot: "bg-slate-400"   },
};

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-platinum-tint/50 pb-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cloud-mist text-action-blue shadow-sm">
        <Icon size={14} strokeWidth={2.5} />
      </span>
      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-steel-gray">{title}</h4>
    </div>
  );
}

export default function BusForm({ bus, onSuccess, onCancel }: BusFormProps) {
  const isEdit = !!bus;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBus, setCurrentBus] = useState<Bus | null>(bus || null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [categories, setCategories] = useState<BusCategory[]>([]);
  const [facilities, setFacilities] = useState<BusFacility[]>([]);

  const [formData, setFormData] = useState<BusFormData>({
    bus_category_id: "",
    plat_number: "",
    name: "",
    seat_count: 0,
    production_year: new Date().getFullYear(),
    brand: "",
    status: "available",
    notes: "",
    facilities: [],
    images: [],
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [catData, facData] = await Promise.all([
          busCategoryService.getAll(),
          busFacilityService.getAll(),
        ]);
        setCategories(catData.categories);
        setFacilities(facData.facilities);
      } catch (err) {
        console.error("Failed to fetch resources", err);
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    if (bus) {
      setFormData({
        bus_category_id: bus.bus_category_id,
        plat_number: bus.plat_number,
        name: bus.name,
        seat_count: bus.seat_count,
        production_year: bus.production_year,
        brand: bus.brand || "",
        status: bus.status,
        notes: bus.notes || "",
        facilities: bus.facilities?.map((f) => f.id) || [],
        images: [],
      });
      const primary = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
      if (primary) setImagePreview(primary.url);
      setCurrentBus(bus);
    }
  }, [bus]);

  const refreshBusData = async () => {
    if (bus?.id) {
      try {
        const updated = await busService.getById(bus.id);
        setCurrentBus(updated);
      } catch (err) {
        console.error("Failed to refresh bus data", err);
      }
    }
  };

  const processImageFiles = (files: File[]) => {
    if (files.length === 0) return;
    setFormData((prev) => ({ ...prev, images: files }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(files[0]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processImageFiles(Array.from(e.target.files || []));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    processImageFiles(files);
  };

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, images: [] }));
  };

  const handleFacilityToggle = (facilityId: string) => {
    setFormData((prev) => {
      const selected = prev.facilities?.includes(facilityId);
      return {
        ...prev,
        facilities: selected
          ? prev.facilities?.filter((id) => id !== facilityId)
          : [...(prev.facilities || []), facilityId],
      };
    });
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
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || apiError.message || "Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    label: `${cat.name} (${cat.min_capacity}–${cat.max_capacity} kursi)`,
    value: cat.id,
  }));

  return (
    <div className="flex flex-col gap-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 font-bold">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <SectionHeader icon={Info} title="Informasi Dasar" />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Input
              label="Nama Armada"
              placeholder="Contoh: Boneh Star Executive"
              icon={BusIcon}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Nomor Plat"
              placeholder="Contoh: B 1234 ABC"
              icon={Hash}
              value={formData.plat_number}
              onChange={(e) => setFormData({ ...formData, plat_number: e.target.value })}
              required
            />
            <Input
              label="Merek / Brand"
              placeholder="Contoh: Mercedes-Benz, Hino"
              icon={Shield}
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
            <Input
              label="Jumlah Kursi"
              type="number"
              placeholder="Contoh: 45"
              icon={Users}
              value={formData.seat_count || ""}
              onChange={(e) => setFormData({ ...formData, seat_count: Number(e.target.value) })}
              required
            />
            <Input
              label="Tahun Produksi"
              type="number"
              placeholder="Contoh: 2023"
              icon={Calendar}
              value={formData.production_year || ""}
              onChange={(e) => setFormData({ ...formData, production_year: Number(e.target.value) })}
              required
            />
            <Select
              label="Kategori Bus"
              icon={Tag}
              options={categoryOptions}
              value={formData.bus_category_id}
              onChange={(value) => setFormData({ ...formData, bus_category_id: value })}
              placeholder="Pilih Kategori"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <SectionHeader icon={Activity} title="Status Operasional" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(Object.keys(statusConfig) as BusStatus[]).map((s) => {
              const isActive = formData.status === s;
              const cfg = statusConfig[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, status: s })}
                  className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all font-bold ${
                    isActive
                      ? `${cfg.color} border-current shadow-sm scale-[1.02]`
                      : "border-platinum-tint/50 bg-white text-slate-blue hover:border-action-blue/30 hover:bg-cloud-mist/30"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${isActive ? cfg.dot : "bg-platinum-tint"}`} />
                  <span className="text-xs">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {!isEdit && (
          <div className="flex flex-col gap-6">
            <SectionHeader icon={ImageIcon} title="Foto Utama Armada" />
            <div
              className={`relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed transition-all ${
                isDragging
                  ? "border-action-blue bg-cloud-mist"
                  : imagePreview
                  ? "border-platinum-tint bg-white"
                  : "border-platinum-tint/50 bg-cloud-mist/20 hover:border-action-blue/40 hover:bg-cloud-mist/40"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-56 w-full rounded-[20px] object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearPreview}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-black/60 text-white transition-all hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-md"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-4 py-1.5 text-[11px] font-bold text-white backdrop-blur-md border border-white/10 shadow-xl">
                    Klik atau seret untuk mengganti foto
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cloud-mist text-action-blue shadow-sm border border-platinum-tint/30 mb-4">
                    <Upload size={24} strokeWidth={2.5} />
                  </div>
                  <p className="text-sm font-bold text-midnight-indigo">
                    Seret foto ke sini atau{" "}
                    <span className="text-action-blue underline underline-offset-4">pilih file</span>
                  </p>
                  <p className="mt-2 text-xs font-medium text-slate-blue opacity-60">PNG, JPG, WEBP — maks. 5 MB</p>
                </>
              )}
              <input
                type="file"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <SectionHeader icon={CheckCircle2} title="Fasilitas Armada" />
          {facilities.length === 0 ? (
            <p className="text-sm italic text-slate-blue opacity-60">Memuat fasilitas…</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {facilities.map((facility) => {
                const selected = formData.facilities?.includes(facility.id);
                return (
                  <label
                    key={facility.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all select-none font-bold ${
                      selected
                        ? "border-action-blue/40 bg-cloud-mist/50 text-midnight-indigo shadow-sm scale-[1.02]"
                        : "border-platinum-tint/20 bg-white text-slate-blue hover:border-platinum-tint hover:bg-cloud-mist/20"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selected}
                      onChange={() => handleFacilityToggle(facility.id)}
                    />
                    <span className={`shrink-0 transition-colors ${selected ? "text-action-blue" : "text-platinum-tint"}`}>
                      {selected ? <CheckCircle2 size={18} strokeWidth={3} /> : <Circle size={18} strokeWidth={2} />}
                    </span>
                    <span className="truncate text-xs">{facility.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <SectionHeader icon={StickyNote} title="Catatan Tambahan" />
          <Textarea
            placeholder="Masukkan catatan atau informasi tambahan tentang armada ini..."
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
          />
        </div>

        <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
          <Button type="button" variant="ghost" className="px-10 font-bold text-slate-blue hover:text-midnight-indigo" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
            {isEdit ? "Simpan Perubahan" : "Daftarkan Armada"}
          </Button>
        </DialogFooter>
      </form>

      {isEdit && currentBus && (
        <div className="mt-12 border-t border-platinum-tint/50 pt-10 pb-6">
          <BusImageGallery
            busId={currentBus.id}
            images={currentBus.images || []}
            onRefresh={refreshBusData}
          />
        </div>
      )}
    </div>
  );
}
