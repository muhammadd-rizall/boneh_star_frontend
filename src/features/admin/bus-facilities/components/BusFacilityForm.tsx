import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { Shield, Save } from "lucide-react";
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

      <div className="flex flex-col gap-5">
        <Input
          label="Facility Name"
          placeholder="e.g. AC, WiFi, Toilet"
          icon={Shield}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Facility" : "Create Facility"}
        </Button>
      </DialogFooter>
    </form>
  );
}
