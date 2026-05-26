import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { DialogFooter } from "@/components/ui/Dialog";
import { roleService } from "../services/RoleService";
import type { Role, RoleFormData, Permission } from "../types/Role";
import { ShieldCheck, Save, CheckSquare, Square, Loader2 } from "lucide-react";

interface RoleFormProps {
  role?: Role | null;
  availablePermissions: Record<string, Permission[]>;
  onSuccess: () => void;
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
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const hasPermissionsData = Object.keys(availablePermissions).length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Role Name"
          placeholder="e.g. Moderator"
          icon={ShieldCheck}
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
        <Input
          label="Slug (System Name)"
          placeholder="e.g. moderator"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          readOnly={isEdit}
          className={isEdit ? "bg-slate-50 opacity-70" : ""}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Permissions Matrix</h4>
          {formData.permissions_ids && formData.permissions_ids.length > 0 && (
            <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              {formData.permissions_ids.length} Selected
            </span>
          )}
        </div>

        {!hasPermissionsData ? (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-slate-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">No permissions available from server.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(availablePermissions).map(([group, perms]) => (
              <div key={group} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                <h5 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  <div className="h-3 w-1 rounded-full bg-slate-400"></div>
                  {group}
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {perms.map((p) => {
                    const isChecked = formData.permissions_ids?.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePermission(p.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left group ${
                          isChecked 
                            ? "border-slate-900 bg-slate-900 text-white shadow-[0_18px_30px_-24px_rgba(15,23,42,0.9)]" 
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                        }`}
                      >
                        <div className={`transition-colors ${isChecked ? "text-white" : "text-slate-300 group-hover:text-slate-500"}`}>
                          {isChecked ? <CheckSquare size={18} fill="currentColor" className="text-white" /> : <Square size={18} />}
                        </div>
                        <span className="text-xs font-medium">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
        <label htmlFor="is_active_role" className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            id="is_active_role"
            className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 text-slate-900 focus:ring-slate-400"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <span>
            <span className="block text-sm font-medium text-slate-800">Role is active</span>
            <span className="text-sm text-slate-500">Role aktif dapat dipakai saat assign akses ke user.</span>
          </span>
        </label>
      </div>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onCancel} className="px-10">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1" loading={loading} icon={Save}>
          {isEdit ? "Update Role" : "Save Role"}
        </Button>
      </DialogFooter>
    </form>
  );
}
