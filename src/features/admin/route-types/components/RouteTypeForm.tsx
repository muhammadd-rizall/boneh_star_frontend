import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { Map, Save, AlignLeft, Globe } from "lucide-react";
import type { RouteType, RouteTypeFormData } from "../types/RouteType";
import { routeTypeService } from "../services/RouteTypeService";

interface RouteTypeFormProps {
  routeType?: RouteType | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RouteTypeForm({ routeType, onSuccess, onCancel }: RouteTypeFormProps) {
  const isEdit = !!routeType;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RouteTypeFormData>({
    name: "",
    scope: "inside",
    description: "",
  });

  useEffect(() => {
    if (routeType) {
      setFormData({
        name: routeType.name,
        scope: routeType.scope,
        description: routeType.description,
      });
    }
  }, [routeType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && routeType) {
        await routeTypeService.update(routeType.id, formData);
      } else {
        await routeTypeService.create(formData);
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
          label="Route Type Name"
          placeholder="e.g. Dalam Kota, Luar Kota"
          icon={Map}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Select
          label="Scope"
          icon={Globe}
          value={formData.scope}
          onChange={(value) => setFormData({ ...formData, scope: value as 'inside' | 'outside' })}
          options={[
            { value: "inside", label: "Inside City" },
            { value: "outside", label: "Outside City" },
          ]}
          required
        />
        
        <Textarea
          label="Description (Optional)"
          placeholder="Describe this route type..."
          icon={AlignLeft}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Route Type" : "Create Route Type"}
        </Button>
      </div>
    </form>
  );
}
