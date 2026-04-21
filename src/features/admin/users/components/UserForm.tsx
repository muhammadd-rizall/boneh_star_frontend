import React, { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { userService } from "../services/UserService";
import type { User, UserFormData } from "../types/User";
import { roleService } from "@/features/admin/roles";
import type { Role } from "@/features/admin/roles";
import { User as UserIcon, Mail, Lock, ShieldCheck, Save } from "lucide-react";

interface UserFormProps {
  user?: User | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const isEdit = !!user;
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role_ids: ["1"],
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role_ids: user.roles.map(r => r.id),
        is_active: user.is_active,
        password: "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const result = await roleService.getAll();
        const activeRoles = result.roles.filter((role) => role.is_active);
        setAvailableRoles(activeRoles);

        if (!user && activeRoles.length > 0) {
          setFormData((prev) => ({
            ...prev,
            role_ids: prev.role_ids.length > 0 ? prev.role_ids : [activeRoles[0].id],
          }));
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch roles.");
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
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

  const roleOptions = availableRoles.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
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
          value={formData.role_ids[0] || ""}
          onChange={(value) => setFormData({ ...formData, role_ids: [value] })}
          placeholder={rolesLoading ? "Loading roles..." : "Select a role"}
        />
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
            <span className="block text-sm font-medium text-slate-800">Account is active</span>
            <span className="text-sm text-slate-500">User dapat masuk dan menggunakan akses yang diberikan.</span>
          </span>
        </label>
      </div>

      <div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-6">
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
