import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { Customer } from "@/features/admin/customers/types/Customer"
import { Edit, Trash2, Mail, Phone, MapPin, User as UserIcon, RotateCcw } from "lucide-react"

interface CustomerTableProps {
  data: Customer[]
  onDelete: (customer: Customer) => void
  onEdit: (customer: Customer) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function CustomerTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore, 
  loading, 
  isTrash = false 
}: CustomerTableProps) {
  const columns: Column<Customer>[] = [
    { 
      header: "Customer Information", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            {row.profile_picture ? (
              <img src={row.profile_picture} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={20} />
            )}
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
      header: "Contact", 
      accessor: (row) => (
        <div className="flex flex-col gap-1 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Phone size={12} className="text-slate-400" />
            <span>{row.phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 max-w-[200px] truncate">
            <MapPin size={12} className="text-slate-400" />
            <span>{row.address || "N/A"}</span>
          </div>
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
          {row.is_active ? "Active" : "Inactive"}
        </span>
      )
    },
    {
      header: "Joined At",
      accessor: (row) => (
        <span className="text-xs text-slate-500">
          {new Date(row.created_at).toLocaleDateString()}
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
                title="Restore Customer" 
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
                title="Edit Customer" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Delete Customer"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
