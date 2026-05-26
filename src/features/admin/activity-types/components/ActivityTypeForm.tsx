import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { Tag, Save, AlignLeft } from "lucide-react";
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
  });

  useEffect(() => {
    if (activityType) {
      setFormData({
        name: activityType.name,
        description: activityType.description,
      });
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
          label="Activity Type Name"
          placeholder="e.g. Tour, Transfer, Charter"
          icon={Tag}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Textarea
          label="Description (Optional)"
          placeholder="Describe this activity type..."
          icon={AlignLeft}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Activity Type" : "Create Activity Type"}
        </Button>
      </DialogFooter>
    </form>
  );
}
