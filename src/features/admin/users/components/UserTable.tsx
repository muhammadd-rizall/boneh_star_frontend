import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { User } from "@/features/admin/users/types/User"
import { Edit, Trash2, Shield, Mail, User as UserIcon, RotateCcw } from "lucide-react"

interface UserTableProps {
  data: User[]
  onDelete: (user: User) => void
  onEdit: (user: User) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function UserTable({ data, onDelete, onEdit, onRestore, loading, isTrash = false }: UserTableProps) {
  const getUserPermissions = (user: User) => {
    const directPermissions = user.permission ?? []
    const rolePermissions = user.roles.flatMap((role) => role.permissions ?? [])
    const mergedPermissions = [...directPermissions, ...rolePermissions]

    return mergedPermissions.filter(
      (permission, index, permissions) =>
        permissions.findIndex((item) => item.id === permission.id) === index
    )
  }

  const columns: Column<User>[] = [
    { 
      header: "User Information", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500">
            <UserIcon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.name}</span>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Mail size={12} />
              <span>{row.email}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: "Role Access", 
      accessor: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.roles.length > 0 ? row.roles.map(role => (
            <div key={role.id} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
              <Shield size={10} />
              <span>{role.name}</span>
            </div>
          )) : (
            <span className="text-[10px] italic text-slate-400">No Role</span>
          )}
        </div>
      )
    },
    {
      header: "Permissions",
      accessor: (row) => {
        const permissions = getUserPermissions(row)

        return (
          <div className="flex flex-wrap gap-1.5">
            {permissions.length > 0 ? (
              permissions.map((permission) => (
                <span
                  key={permission.id}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                >
                  {permission.name}
                </span>
              ))
            ) : (
              <span className="text-[10px] italic text-slate-400">No Permission</span>
            )}
          </div>
        )
      }
    },
    {
      header: "Account Status",
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
          row.is_active 
            ? "border border-emerald-200 bg-emerald-50 text-emerald-700" 
            : "border border-slate-200 bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-slate-400"}`}></span>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
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
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
