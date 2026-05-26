import { useState } from "react"
import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import type { User } from "@/features/admin/users/types/User"
import { Edit, Trash2, Shield, Mail, User as UserIcon, RotateCcw, Key } from "lucide-react"

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
      header: "User Information",
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
            <UserIcon size={20} />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate leading-tight font-semibold text-slate-800">{row.name}</span>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Mail size={12} className="shrink-0" />
              <span className="truncate">{row.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Role Access",
      accessor: (row) => {
        const roles = row.roles ?? []
        const MAX_VISIBLE_ROLES = 1
        const visibleRoles = roles.slice(0, MAX_VISIBLE_ROLES)
        const hiddenRolesCount = roles.length - MAX_VISIBLE_ROLES

        return (
          <div className="flex flex-wrap items-center gap-1">
            {roles.length > 0 ? (
              <>
                {visibleRoles.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600"
                  >
                    <Shield size={10} />
                    <span>{role.name}</span>
                  </div>
                ))}
                {hiddenRolesCount > 0 && (
                  <button 
                    onClick={() => handleShowDetail(row)}
                    className="flex items-center whitespace-nowrap rounded-full border border-slate-300 bg-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-300 transition-colors"
                  >
                    +{hiddenRolesCount}
                  </button>
                )}
              </>
            ) : (
              <span className="text-[10px] italic text-slate-400">No Role</span>
            )}
          </div>
        )
      },
    },
    {
      header: "Permissions",
      accessor: (row) => {
        const permissions = getUserPermissions(row)
        const MAX_VISIBLE = 2
        const visiblePerms = permissions.slice(0, MAX_VISIBLE)
        const hiddenPermsCount = permissions.length - MAX_VISIBLE

        return (
          <div className="flex flex-wrap items-center gap-1">
            {permissions.length > 0 ? (
              <>
                {visiblePerms.map((permission) => (
                  <span
                    key={permission.id}
                    className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                  >
                    {permission.name}
                  </span>
                ))}
                {hiddenPermsCount > 0 && (
                  <button 
                    onClick={() => handleShowDetail(row)}
                    className="flex items-center whitespace-nowrap rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    +{hiddenPermsCount} more
                  </button>
                )}
              </>
            ) : (
              <span className="text-[10px] italic text-slate-400">No Permission</span>
            )}
          </div>
        )
      },
    },
    {
      header: "Account Status",
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
            row.is_active
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-slate-200 bg-slate-100 text-slate-500"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-slate-400"}`} />
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {isTrash ? (
            <>
              <Button
                size="sm"
                variant="outline"
                icon={RotateCcw}
                className="h-9 w-9 rounded-full p-0"
                onClick={() => onRestore?.(row.id)}
                title="Restore User"
              />
              <Button
                size="sm"
                variant="danger"
                icon={Trash2}
                className="h-9 w-9 rounded-full p-0"
                onClick={() => onDelete(row)}
                title="Permanently Delete"
              />
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                icon={Edit}
                className="h-9 w-9 rounded-full p-0"
                onClick={() => onEdit(row)}
                title="Edit User"
              />
              <Button
                size="sm"
                variant="danger"
                icon={Trash2}
                className="h-9 w-9 rounded-full p-0"
                onClick={() => onDelete(row)}
                title="Delete User"
              />
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
          <div className="flex flex-col gap-8 py-2">
            {/* Roles Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Shield size={18} className="text-slate-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Roles</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedUser.roles?.map(role => (
                  <div key={role.id} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700">
                    <Shield size={14} className="text-slate-400" />
                    {role.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Permissions Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Key size={18} className="text-slate-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Full Permissions ({getUserPermissions(selectedUser).length})
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {getUserPermissions(selectedUser).map(permission => (
                  <div key={permission.id} className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50/30 group">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500">
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 group-hover:text-indigo-700">
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
