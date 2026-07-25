import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import type { User } from "@/features/admin/users/types/User"
import { Edit, Trash2, Shield, Mail, User as UserIcon, RotateCcw, Key } from "lucide-react"
import { cn } from "@/lib/utils"
import { useModulePermission } from "@/hooks/useModulePermission"

interface UserTableProps {
  data: User[]
  onDelete: (user: User) => void
  onEdit: (user: User) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function UserTable({ data, onDelete, onEdit, onRestore, loading, isTrash = false }: UserTableProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const { canUpdate, canDelete } = useModulePermission("users")

  const getUserPermissions = (user: User) => {
    const directPermissions = user.permissions ?? []
    const rolePermissions = user.roles?.flatMap((role) => role.permissions ?? []) ?? []
    const mergedPermissions = [...directPermissions, ...rolePermissions]

    return mergedPermissions.filter(
      (permission, index, permissions) =>
        permissions.findIndex((item) => item.id === permission.id) === index
    )
  }

  const handleShowDetail = (user: User) => {
    setSelectedUser(user)
    setIsDetailOpen(true)
  }

  const columns: Column<User>[] = [
    {
      header: "Identitas Pengguna",
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left py-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-platinum-tint bg-cloud-mist text-slate-blue shadow-sm">
            <UserIcon size={24} strokeWidth={2.5} className="text-action-blue" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate leading-tight font-bold text-midnight-indigo">{row.name}</span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-blue opacity-60">
              <Mail size={12} className="shrink-0" />
              <span className="truncate">{row.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Hak Akses",
      accessor: (row) => {
        const roles = row.roles ?? []
        const MAX_VISIBLE_ROLES = 1
        const visibleRoles = roles.slice(0, MAX_VISIBLE_ROLES)
        const hiddenRolesCount = roles.length - MAX_VISIBLE_ROLES

        return (
          <div className="flex flex-wrap items-center gap-2">
            {roles.length > 0 ? (
              <>
                {visibleRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-action-blue shadow-sm"
                  >
                    <Shield size={10} strokeWidth={3} />
                    <span>{role.name}</span>
                  </div>
                ))}
                {hiddenRolesCount > 0 && (
                  <button 
                    onClick={() => handleShowDetail(row)}
                    className="flex items-center whitespace-nowrap rounded-lg border border-platinum-tint bg-cloud-mist px-2 py-1 text-[10px] font-bold text-slate-blue hover:bg-platinum-tint transition-all"
                  >
                    +{hiddenRolesCount}
                  </button>
                )}
              </>
            ) : (
              <span className="text-[10px] font-bold text-slate-blue opacity-40 italic">Tanpa Role</span>
            )}
          </div>
        )
      },
    },
    {
      header: "Izin Sistem",
      accessor: (row) => {
        const permissions = getUserPermissions(row)
        const MAX_VISIBLE = 2
        const visiblePerms = permissions.slice(0, MAX_VISIBLE)
        const hiddenPermsCount = permissions.length - MAX_VISIBLE

        return (
          <div className="flex flex-wrap items-center gap-2">
            {permissions.length > 0 ? (
              <>
                {visiblePerms.map((permission) => (
                  <span
                    key={permission.id}
                    className="whitespace-nowrap rounded-lg border border-platinum-tint bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-blue opacity-70"
                  >
                    {permission.name}
                  </span>
                ))}
                {hiddenPermsCount > 0 && (
                  <button 
                    onClick={() => handleShowDetail(row)}
                    className="flex items-center whitespace-nowrap rounded-lg border border-indigo-100 bg-indigo-50 px-2 py-1 text-[10px] font-bold text-royal-amethyst hover:bg-indigo-100 transition-all"
                  >
                    +{hiddenPermsCount} lagi
                  </button>
                )}
              </>
            ) : (
              <span className="text-[10px] font-bold text-slate-blue opacity-40 italic">Tanpa Izin</span>
            )}
          </div>
        )
      },
    },
    {
      header: "Status Akun",
      accessor: (row) => (
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] border shadow-sm",
            row.is_active
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-100 text-slate-500"
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", row.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
          {row.is_active ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {isTrash ? (
            <>
              {canUpdate && (
                <Button
                  size="icon-sm"
                  variant="outline"
                  icon={RotateCcw}
                  className="h-9 w-9 rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-500"
                  onClick={() => onRestore?.(row.id)}
                  title="Pulihkan Pengguna"
                />
              )}
              {canDelete && (
                <Button
                  size="icon-sm"
                  variant="danger"
                  icon={Trash2}
                  className="h-9 w-9 rounded-xl shadow-sm"
                  onClick={() => onDelete(row)}
                  title="Hapus Permanen"
                />
              )}
            </>
          ) : (
            <>
              {canUpdate && (
                <Button
                  size="icon-sm"
                  variant="outline"
                  icon={Edit}
                  className="h-9 w-9 rounded-xl shadow-sm hover:border-action-blue hover:text-action-blue"
                  onClick={() => onEdit(row)}
                  title="Edit Pengguna"
                />
              )}
              {canDelete && (
                <Button
                  size="icon-sm"
                  variant="danger"
                  icon={Trash2}
                  className="h-9 w-9 rounded-xl shadow-sm"
                  onClick={() => onDelete(row)}
                  title="Hapus Pengguna"
                />
              )}
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={data} loading={loading} paginated />

      <Modal 
        open={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Detail Akses Pengguna"
        subtitle={selectedUser?.name}
        size="lg"
      >
        {selectedUser && (
          <div className="flex flex-col gap-10 py-2">
            {/* Roles Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
                <Shield size={20} strokeWidth={2.5} className="text-action-blue" />
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-steel-gray">Role Sistem</h4>
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedUser.roles?.map(role => (
                  <div key={role.id} className="flex items-center gap-2.5 rounded-xl border border-platinum-tint bg-white px-5 py-3 text-sm font-semibold text-midnight-indigo shadow-sm transition-all hover:border-action-blue/30">
                    <Shield size={16} className="text-action-blue" />
                    {role.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions Section */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-platinum-tint/50 pb-3">
                <Key size={20} strokeWidth={2.5} className="text-action-blue" />
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-steel-gray">
                  Daftar Izin Sistem ({getUserPermissions(selectedUser).length})
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-3 [scrollbar-width:none]">
                {getUserPermissions(selectedUser).map(permission => (
                  <div key={permission.id} className="flex items-center gap-3 rounded-xl border border-platinum-tint/40 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-action-blue/20 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cloud-mist text-slate-blue group-hover:bg-blue-50 group-hover:text-action-blue">
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <span className="text-xs font-semibold text-midnight-indigo opacity-80 group-hover:opacity-100">
                      {permission.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
