import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { roleService } from "../services/RoleService";
import type { Role, RoleFormData, Permission } from "../types/Role";
import { ShieldCheck, Save, CheckSquare, Square, Loader2, XCircle, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleFormProps {
  role?: Role | null;
  availablePermissions: Record<string, Permission[]>;
  onSuccess: (roleName?: string) => void;
  onCancel: () => void;
}

export default function RoleForm({ role, availablePermissions, onSuccess, onCancel }: RoleFormProps) {
  const isEdit = !!role;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RoleFormData>({
    name: "",
    slug: "",
    is_active: true,
    permissions_ids: [],
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        slug: role.slug,
        is_active: role.is_active,
        permissions_ids: role.permissions?.map(p => p.id) || [],
      });
    }
  }, [role]);

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slug
    }));
  };

  const togglePermission = (id: string) => {
    const current = [...(formData.permissions_ids || [])];
    const index = current.indexOf(id);
    if (index === -1) {
      current.push(id);
    } else {
      current.splice(index, 1);
    }
    setFormData({ ...formData, permissions_ids: current });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit && role) {
        await roleService.update(role.id, formData);
      } else {
        await roleService.create(formData);
      }
      onSuccess(formData.name);
    } catch (err: any) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const hasPermissionsData = Object.keys(availablePermissions).length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <XCircle size={18} className="text-red-500" />
            {error}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
            <ShieldCheck size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Informasi Hak Akses</h3>
            <p className="text-xs font-medium text-slate-blue opacity-70">Definisikan nama dan identitas role sistem</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nama Role"
            placeholder="Contoh: Moderator, Keuangan"
            icon={ShieldCheck}
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
          <Input
            label="Slug (Nama Sistem)"
            placeholder="Contoh: moderator"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            readOnly={isEdit}
            className={isEdit ? "bg-cloud-mist/50 opacity-70" : ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-platinum-tint/50 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
              <ClipboardList size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Matriks Izin (Permissions)</h3>
              <p className="text-xs font-medium text-slate-blue opacity-70">Pilih aksi yang diperbolehkan untuk role ini</p>
            </div>
          </div>
          {formData.permissions_ids && formData.permissions_ids.length > 0 && (
            <span className="rounded-full bg-action-blue px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-button">
              {formData.permissions_ids.length} Terpilih
            </span>
          )}
        </div>

        {!hasPermissionsData ? (
          <div className="rounded-[24px] border border-dashed border-platinum-tint bg-cloud-mist/30 p-12 text-center">
            <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-platinum-tint" />
            <p className="text-sm font-semibold text-slate-blue opacity-60">Memuat data izin dari server...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(availablePermissions).map(([group, perms]) => (
              <div key={group} className="rounded-[24px] border border-platinum-tint bg-white p-8 shadow-sm">
                <h5 className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-steel-gray">
                  <div className="h-3 w-1.5 rounded-full bg-action-blue"></div>
                  {group}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {perms.map((p) => {
                    const isChecked = formData.permissions_ids?.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePermission(p.id)}
                        className={cn(
                          "flex items-center gap-4 px-5 py-4 rounded-xl border-2 transition-all text-left font-semibold group",
                          isChecked 
                            ? "border-midnight-indigo bg-midnight-indigo text-white shadow-button scale-[1.02]" 
                            : "border-platinum-tint/30 bg-white text-slate-blue hover:border-action-blue/30 hover:bg-cloud-mist/20"
                        )}
                      >
                        <div className={cn("transition-colors", isChecked ? "text-white" : "text-platinum-tint group-hover:text-action-blue")}>
                          {isChecked ? <CheckSquare size={20} strokeWidth={2.5} /> : <Square size={20} strokeWidth={2} />}
                        </div>
                        <span className="text-sm">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-platinum-tint bg-cloud-mist/30 px-6 py-6 transition-all hover:bg-cloud-mist/50">
        <label htmlFor="is_active_role" className="flex cursor-pointer items-start gap-4">
          <div className="relative flex items-center justify-center h-6 w-6 shrink-0 mt-0.5">
            <input
              type="checkbox"
              id="is_active_role"
              className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-platinum-tint bg-white transition-all checked:bg-action-blue checked:border-action-blue focus:ring-4 focus:ring-action-blue/10"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            />
            <Save size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-midnight-indigo">Role Aktif</span>
            <span className="text-sm font-medium text-slate-blue opacity-70">Role aktif dapat digunakan saat penugasan akses ke pengguna.</span>
          </div>
        </label>
      </div>

      <DialogFooter className="mt-4 border-t border-platinum-tint/40 pt-8">
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10 font-semibold text-slate-blue hover:text-midnight-indigo">Batal</Button>
        <Button type="submit" variant="primary" className="flex-1 font-semibold h-14 rounded-xl shadow-button" loading={loading} icon={Save}>
          {isEdit ? "Simpan Perubahan" : "Buat Role Baru"}
        </Button>
      </DialogFooter>
    </form>
  );
}
