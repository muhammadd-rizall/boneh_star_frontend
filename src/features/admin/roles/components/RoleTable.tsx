import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { Role } from "../types/Role"
import { Edit, Trash2, ShieldCheck, Users } from "lucide-react"

interface RoleTableProps {
  data: Role[]
  onDelete: (role: Role) => void
  onEdit: (role: Role) => void
  loading?: boolean
}

export default function RoleTable({ data, onDelete, onEdit, loading }: RoleTableProps) {
  const columns: Column<Role>[] = [
    { 
      header: "Role Identity", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.name}</span>
            <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">{row.slug}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Permissions Count", 
      accessor: (row) => (
        <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
          {row.permissions?.length || 0} Permissions
        </span>
      )
    },
    { 
      header: "Active Users", 
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Users size={14} className="text-slate-400" />
          <span>{row.users_count || 0}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
          row.is_active 
            ? "border border-emerald-200 bg-emerald-50 text-emerald-700" 
            : "border border-slate-200 bg-slate-100 text-slate-500"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${row.is_active ? "bg-emerald-500" : "bg-slate-400"}`}></span>
          {row.is_active ? "Active" : "Disabled"}
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
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onEdit(row)}
          />
          <Button 
            size="sm" 
            variant="danger" 
            icon={Trash2} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onDelete(row)}
          />
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
