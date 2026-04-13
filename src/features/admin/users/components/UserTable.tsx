import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { User } from "@/features/admin/users/types/User"
import { Edit, Trash2, Shield, Mail, User as UserIcon } from "lucide-react"

interface UserTableProps {
  data: User[]
  onDelete: (user: User) => void
  onEdit: (user: User) => void
  loading?: boolean
}

export default function UserTable({ data, onDelete, onEdit, loading }: UserTableProps) {
  const columns: Column<User>[] = [
    { 
      header: "User Information", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <UserIcon size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 leading-tight">{row.name}</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-medium">
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
            <div key={role.id} className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 uppercase tracking-wider border border-indigo-100">
              <Shield size={10} />
              <span>{role.name}</span>
            </div>
          )) : (
            <span className="text-[10px] font-bold text-slate-400 italic">No Role</span>
          )}
        </div>
      )
    },
    {
      header: "Account Status",
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.is_active 
            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
            : "bg-rose-50 text-rose-600 border border-rose-100"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-rose-500"}`}></span>
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            icon={Edit} 
            className="h-9 w-9 p-0 rounded-xl hover:border-indigo-600 hover:text-indigo-600" 
            onClick={() => onEdit(row)}
            title="Edit User" 
          />
          <Button 
            size="sm" 
            variant="danger" 
            icon={Trash2} 
            className="h-9 w-9 p-0 rounded-xl bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white" 
            onClick={() => onDelete(row)}
            title="Delete User"
          />
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
