import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { Tag, Bus as BusIcon, Users, Save, Calendar, Hash, Shield, Info, Image as ImageIcon } from "lucide-react";
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
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

type BusStatus = 'available' | 'booked' | 'maintenance' | 'inactive';

export default function BusForm({ bus, onSuccess, onCancel }: BusFormProps) {
  const isEdit = !!bus;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBus, setCurrentBus] = useState<Bus | null>(bus || null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
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
        facilities: bus.facilities?.map(f => f.id) || [],
        images: [],
      });
      // Set preview from primary image or first image if available
      const primaryImage = bus.images?.find(img => img.is_primary) || bus.images?.[0];
      if (primaryImage) {
        setImagePreview(primaryImage.url);
      }
      setCurrentBus(bus);
    }
  }, [bus]);

  const refreshBusData = async () => {
    if (bus?.id) {
      try {
        const updatedBus = await busService.getById(bus.id);
        setCurrentBus(updatedBus);
      } catch (err) {
        console.error("Failed to refresh bus data", err);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setFormData({ ...formData, images: files });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleFacilityToggle = (facilityId: string) => {
    setFormData(prev => {
      const isSelected = prev.facilities?.includes(facilityId);
      if (isSelected) {
        return { ...prev, facilities: prev.facilities?.filter(id => id !== facilityId) };
      } else {
        return { ...prev, facilities: [...(prev.facilities || []), facilityId] };
      }
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
      const errorMessage = apiError.response?.data?.message || apiError.message || "Something went wrong.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "Available", value: "available" },
    { label: "Booked", value: "booked" },
    { label: "Maintenance", value: "maintenance" },
    { label: "Inactive", value: "inactive" },
  ];

  const categoryOptions = categories.map(cat => ({
    label: `${cat.name} (${cat.min_capacity}-${cat.max_capacity} Seats)`,
    value: cat.id
  }));

  return (
    <div className="flex flex-col gap-8 max-h-[80vh] overflow-y-auto px-1">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Info size={18} className="text-indigo-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Basic Information</h4>
          </div>
          
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Bus Name"
              placeholder="e.g. Boneh Star Executive"
              icon={BusIcon}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Plat Number"
              placeholder="e.g. B 1234 ABC"
              icon={Hash}
              value={formData.plat_number}
              onChange={(e) => setFormData({ ...formData, plat_number: e.target.value })}
              required
            />

            <Select
              label="Bus Category"
              icon={Tag}
              options={categoryOptions}
              value={formData.bus_category_id}
              onChange={(value) => setFormData({ ...formData, bus_category_id: value })}
              placeholder="Select Category"
            />

            <Input
              label="Seat Count"
              type="number"
              placeholder="e.g. 45"
              icon={Users}
              value={formData.seat_count || ""}
              onChange={(e) => setFormData({ ...formData, seat_count: Number(e.target.value) })}
              required
            />

            <Input
              label="Production Year"
              type="number"
              placeholder="e.g. 2023"
              icon={Calendar}
              value={formData.production_year || ""}
              onChange={(e) => setFormData({ ...formData, production_year: Number(e.target.value) })}
              required
            />

            <Input
              label="Brand"
              placeholder="e.g. Mercedes-Benz"
              icon={Shield}
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />

            <Select
              label="Status"
              icon={Shield}
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as BusStatus })}
            />
          </div>
        </div>

        {/* Section Image Thumbnail */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <ImageIcon size={18} className="text-indigo-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Main Thumbnail</h4>
          </div>
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
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-800">Upload Bus Image</span>
              <span className="text-xs text-slate-500">Select a primary photo for this bus.</span>
            </div>
          </div>
        </div>

        {/* Section 2: Facilities */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Shield size={18} className="text-indigo-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Bus Facilities</h4>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {facilities.map(facility => (
              <label 
                key={facility.id} 
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                  formData.facilities?.includes(facility.id) 
                    ? "border-indigo-500 bg-indigo-50/50 text-indigo-700" 
                    : "border-slate-100 bg-white text-slate-600 hover:border-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.facilities?.includes(facility.id)}
                  onChange={() => handleFacilityToggle(facility.id)}
                />
                <span className="text-xs font-bold truncate">{facility.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Section 3: Additional Notes */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Info size={18} className="text-indigo-500" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">Additional Notes</h4>
          </div>
          <textarea
            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-slate-100 min-h-[100px]"
            placeholder="Enter any additional notes about this bus..."
            value={formData.notes || ""}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
          <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
            {isEdit ? "Update Bus Details" : "Register New Bus"}
          </Button>
        </div>
      </form>

      {isEdit && currentBus && (
        <div className="border-t border-slate-100 pt-8 pb-4">
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
