import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { Driver } from "@/features/admin/drivers/types/Driver"
import { Edit, Trash2, UserCircle, RotateCcw, Phone } from "lucide-react"

interface DriverTableProps {
  data: Driver[]
  onDelete: (driver: Driver) => void
  onEdit: (driver: Driver) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function DriverTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore,
  loading, 
  isTrash = false 
}: DriverTableProps) {
  const columns: Column<Driver>[] = [
    { 
      header: "Driver", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            {row.photo ? (
              <img src={row.photo} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <UserCircle size={20} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.name}</span>
            <span className="text-xs text-slate-500 line-clamp-1">{row.address}</span>
          </div>
        </div>
      )
    },
    {
      header: "Contact",
      accessor: (row) => (
        <div className="flex items-center gap-2 text-slate-600">
          <Phone size={14} className="text-slate-400" />
          <span className="text-sm font-medium">{row.phone}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const styles = {
          available: 'bg-emerald-50 text-emerald-600 border-emerald-100',
          on_duty: 'bg-indigo-50 text-indigo-600 border-indigo-100',
          inactive: 'bg-slate-50 text-slate-500 border-slate-100'
        }
        const labels = {
          available: 'Available',
          on_duty: 'On Duty',
          inactive: 'Inactive'
        }
        return (
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[row.status]}`}>
            {labels[row.status]}
          </span>
        )
      }
    },
    {
      header: "Created At",
      accessor: (row) => (
        <span className="text-xs text-slate-500 font-medium">
          {new Date(row.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
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
                title="Restore Driver" 
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
                title="Edit Driver" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Delete Driver"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
