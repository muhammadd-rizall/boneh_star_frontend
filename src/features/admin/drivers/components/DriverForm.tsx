import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { User, Save, Phone, MapPin, Image as ImageIcon, Info } from "lucide-react";
import type { Driver, DriverFormData } from "../types/Driver";
import { driverService } from "../services/DriverService";

interface DriverFormProps {
  driver?: Driver | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DriverForm({ driver, onSuccess, onCancel }: DriverFormProps) {
  const isEdit = !!driver;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<DriverFormData>({
    name: "",
    phone: "",
    address: "",
    photo: "",
    status: "available",
    notes: "",
  });

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name,
        phone: driver.phone,
        address: driver.address,
        photo: driver.photo || "",
        status: driver.status,
        notes: driver.notes || "",
      });
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && driver) {
        await driverService.update(driver.id, formData);
      } else {
        await driverService.create(formData);
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

        <Input
          label="Photo URL"
          placeholder="https://example.com/photo.jpg"
          icon={ImageIcon}
          value={formData.photo || ""}
          onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
        />

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

        <div className="md:col-span-2">
          <Textarea
            label="Notes"
            placeholder="Additional notes about the driver..."
            icon={Info}
            value={formData.notes || ""}
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
