import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { Layout, Users, FileText, Save } from "lucide-react";
import type { BusCategory, BusCategoryFormData } from "../types/BusCategory";
import { busCategoryService } from "../services/BusCategoryService";

interface BusCategoryFormProps {
  category?: BusCategory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BusCategoryForm({ category, onSuccess, onCancel }: BusCategoryFormProps) {
  const isEdit = !!category;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<BusCategoryFormData>({
    name: "",
    min_capacity: 1,
    max_capacity: 1,
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        min_capacity: category.min_capacity || 1,
        max_capacity: category.max_capacity || 1,
        description: category.description || "",
      });
    } else {
      setFormData({
        name: "",
        min_capacity: 1,
        max_capacity: 1,
        description: "",
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        if (!category?.id) {
          throw new Error("ID Kategori tidak ditemukan. Tidak dapat memperbarui data.");
        }
        await busCategoryService.update(category.id, formData);
      } else {
        await busCategoryService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Form submission error:", err);
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
          label="Category Name"
          placeholder="e.g. Big Bus"
          icon={Layout}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Min Capacity"
            type="number"
            placeholder="e.g. 30"
            icon={Users}
            value={formData.min_capacity}
            onChange={(e) => setFormData({ ...formData, min_capacity: Number(e.target.value) })}
            required
            min={1}
          />

          <Input
            label="Max Capacity"
            type="number"
            placeholder="e.g. 50"
            icon={Users}
            value={formData.max_capacity}
            onChange={(e) => setFormData({ ...formData, max_capacity: Number(e.target.value) })}
            required
            min={1}
          />
        </div>

        <div className="w-full">
          <label className="ml-1 mb-1.5 block text-sm font-medium text-slate-700">Description</label>
          <div className="relative group">
            <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <FileText size={18} />
            </div>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-slate-400 focus:ring-4 focus:ring-slate-100 min-h-[100px]"
              placeholder="Enter category description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Category" : "Create Category"}
        </Button>
      </DialogFooter>
    </form>
  );
}
