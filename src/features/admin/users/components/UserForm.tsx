import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { userService } from "../services/UserService";
import type { User, UserFormData } from "../types/User";
import { roleService } from "@/features/admin/roles";
import type { Role } from "@/features/admin/roles";
import { User as UserIcon, Mail, Lock, ShieldCheck, Save, XCircle } from "lucide-react";

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
        role_ids: user.roles?.map(r => r.id) ?? [],
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
        setError("Gagal mengambil data hak akses.");
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
      setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = availableRoles.map((role) => ({
    label: role.name,
    value: role.id,
  }));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <XCircle size={18} className="text-red-500" />
            {error}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          icon={UserIcon}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <Input
          label="Alamat Email"
          type="email"
          placeholder="nama@contoh.com"
          icon={Mail}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          label={isEdit ? "Kata Sandi (Kosongkan jika tidak diubah)" : "Kata Sandi"}
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!isEdit}
        />

        <Select
          label="Hak Akses Sistem"
          options={roleOptions}
          icon={ShieldCheck}
          value={formData.role_ids[0] || ""}
          onChange={(value) => setFormData({ ...formData, role_ids: [value] })}
          placeholder={rolesLoading ? "Memuat hak akses..." : "Pilih hak akses"}
        />
      </div>

      <div className="rounded-[24px] border border-platinum-tint bg-cloud-mist/30 px-6 py-6 transition-all hover:bg-cloud-mist/50">
        <label htmlFor="is_active" className="flex cursor-pointer items-start gap-4">
          <div className="relative flex items-center justify-center h-6 w-6 shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="is_active"
              className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-platinum-tint bg-white transition-all checked:bg-action-blue checked:border-action-blue focus:ring-4 focus:ring-action-blue/10"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <Save size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-midnight-indigo">Akun Aktif</span>
            <span className="text-sm font-medium text-slate-blue opacity-70">Pengguna dapat masuk dan menggunakan akses yang diberikan.</span>
          </div>
        </label>
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10 font-bold text-slate-blue hover:text-midnight-indigo">Batal</Button>
        <Button type="submit" variant="primary" className="flex-1 font-bold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Perbarui Pengguna" : "Daftarkan Pengguna"}
        </Button>
      </DialogFooter>
    </form>
  );
}
