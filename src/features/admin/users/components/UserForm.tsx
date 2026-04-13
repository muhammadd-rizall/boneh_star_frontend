import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { userService } from "../services/UserService";
import type { User, UserFormData } from "../types/User";
import { User as UserIcon, Mail, Lock, ShieldCheck, Save } from "lucide-react";

interface UserFormProps {
  user?: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const isEdit = !!user;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role_ids: ["1"], // Backend mengharapkan array
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role_ids: user.roles.map(r => r.id), // Mengambil semua ID role
        is_active: user.is_active,
        password: "",
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && user) {
        await userService.update(user.id, formData);
      } else {
        await userService.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { label: "Administrator", value: "1" },
    { label: "Customer", value: "2" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        placeholder="Enter full name"
        icon={UserIcon}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        label="Email Address"
        type="email"
        placeholder="name@example.com"
        icon={Mail}
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <Input
        label={isEdit ? "Password (Kosongkan jika tidak diubah)" : "Password"}
        type="password"
        placeholder="••••••••"
        icon={Lock}
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required={!isEdit}
      />

      <Select
        label="System Role"
        options={roleOptions}
        icon={ShieldCheck}
        value={formData.role_ids[0] || ""} // Sementara single select tapi kirim array
        onChange={(value) => setFormData({ ...formData, role_ids: [value] })}
      />

      <div className="flex items-center gap-2 px-1">
        <input
          type="checkbox"
          id="is_active"
          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
        />
        <label htmlFor="is_active" className="text-sm font-semibold text-slate-700 cursor-pointer">
          Account is Active
        </label>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-6 border-t border-slate-50">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
