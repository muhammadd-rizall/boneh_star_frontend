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
  Activity,
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
  available:   { label: "Available",   color: "border-emerald-200 bg-emerald-50 text-emerald-700",  dot: "bg-emerald-500"  },
  booked:      { label: "Booked",      color: "border-blue-200   bg-blue-50   text-blue-700",       dot: "bg-blue-500"    },
  maintenance: { label: "Maintenance", color: "border-amber-200  bg-amber-50  text-amber-700",      dot: "bg-amber-500"   },
  inactive:    { label: "Inactive",    color: "border-slate-200  bg-slate-100 text-slate-500",      dot: "bg-slate-400"   },
};

// ── Section header helper ────────────────────────────────────────────────────
function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500">
        <Icon size={14} />
      </span>
      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h4>
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

  // ── Fetch categories & facilities ────────────────────────────────────────
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

  // ── Pre-fill when editing ────────────────────────────────────────────────
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

  // ── Image helpers ────────────────────────────────────────────────────────
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

  // ── Facility toggle ──────────────────────────────────────────────────────
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

  // ── Submit ───────────────────────────────────────────────────────────────
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
      setError(apiError.response?.data?.message || apiError.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    label: `${cat.name} (${cat.min_capacity}–${cat.max_capacity} kursi)`,
    value: cat.id,
  }));

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-0">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-rose-400 text-rose-500 flex items-center justify-center text-[10px] font-bold">!</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* ── Section 1: Basic Information ── */}
        <div className="flex flex-col gap-5">
          <SectionHeader icon={Info} title="Informasi Dasar" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Input
              label="Nama Bus"
              placeholder="e.g. Boneh Star Executive"
              icon={BusIcon}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Nomor Plat"
              placeholder="e.g. B 1234 ABC"
              icon={Hash}
              value={formData.plat_number}
              onChange={(e) => setFormData({ ...formData, plat_number: e.target.value })}
              required
            />
            <Input
              label="Merek / Brand"
              placeholder="e.g. Mercedes-Benz, Hino"
              icon={Shield}
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
            <Input
              label="Jumlah Kursi"
              type="number"
              placeholder="e.g. 45"
              icon={Users}
              value={formData.seat_count || ""}
              onChange={(e) => setFormData({ ...formData, seat_count: Number(e.target.value) })}
              required
            />
            <Input
              label="Tahun Produksi"
              type="number"
              placeholder="e.g. 2023"
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

        {/* ── Section 2: Status ── */}
        <div className="flex flex-col gap-5">
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
                  className={`flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
                    isActive
                      ? `${cfg.color} border-current`
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${isActive ? cfg.dot : "bg-slate-300"}`} />
                  <span className="text-xs font-semibold">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Section 3: Thumbnail (Create-only) ── */}
        {!isEdit && (
          <div className="flex flex-col gap-5">
            <SectionHeader icon={ImageIcon} title="Foto Utama Bus" />
            <div
              className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${
                isDragging
                  ? "border-indigo-400 bg-indigo-50"
                  : imagePreview
                  ? "border-slate-200 bg-slate-50"
                  : "border-slate-200 bg-gradient-to-b from-slate-50 to-white hover:border-indigo-300 hover:from-indigo-50/40"
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
                    className="max-h-48 w-full rounded-2xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearPreview}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                  >
                    <X size={13} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-lg bg-black/50 px-3 py-1 text-[11px] font-medium text-white">
                    Klik atau seret untuk mengganti foto
                  </div>
                </>
              ) : (
                <>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-400">
                    <Upload size={22} />
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Seret foto ke sini atau{" "}
                    <span className="text-indigo-500 underline underline-offset-2">pilih file</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-400">PNG, JPG, WEBP — maks. 5 MB</p>
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

        {/* ── Section 4: Facilities ── */}
        <div className="flex flex-col gap-5">
          <SectionHeader icon={CheckCircle2} title="Fasilitas Bus" />
          {facilities.length === 0 ? (
            <p className="text-sm italic text-slate-400">Memuat fasilitas…</p>
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
              {facilities.map((facility) => {
                const selected = formData.facilities?.includes(facility.id);
                return (
                  <label
                    key={facility.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-all select-none ${
                      selected
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selected}
                      onChange={() => handleFacilityToggle(facility.id)}
                    />
                    <span className={`shrink-0 transition-colors ${selected ? "text-indigo-500" : "text-slate-300"}`}>
                      {selected ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </span>
                    <span className="truncate text-xs font-semibold">{facility.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Section 5: Notes ── */}
        <div className="flex flex-col gap-5">
          <SectionHeader icon={Info} title="Catatan Tambahan" />
          <Textarea
            placeholder="Masukkan catatan atau informasi tambahan tentang bus ini..."
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
        </div>

        {/* ── Action Buttons ── */}
        <DialogFooter>
          <Button type="button" variant="ghost" className="px-10" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
            {isEdit ? "Simpan Perubahan" : "Daftarkan Bus"}
          </Button>
        </DialogFooter>
      </form>

      {/* ── Image Gallery (edit mode only) ── */}
      {isEdit && currentBus && (
        <div className="mt-8 border-t border-slate-100 pt-8 pb-4">
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
