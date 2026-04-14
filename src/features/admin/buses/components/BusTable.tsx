import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { Bus } from "@/features/admin/buses/types/Bus"
import { Edit, Trash2, Bus as BusIcon, Tag, Users, Banknote } from "lucide-react"

interface BusTableProps {
  data: Bus[]
  onDelete: (bus: Bus) => void
  onEdit: (bus: Bus) => void
  loading?: boolean
}

export default function BusTable({ data, onDelete, onEdit, loading }: BusTableProps) {
  const columns: Column<Bus>[] = [
    { 
      header: "Bus Information", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            {row.image ? (
              <img src={row.image} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <BusIcon size={20} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.name}</span>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Tag size={12} />
              <span>{row.code}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: "Capacity", 
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Users size={14} className="text-slate-400" />
          <span>{row.capacity} Seats</span>
        </div>
      )
    },
    { 
      header: "Price", 
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Banknote size={14} className="text-slate-400" />
          <span>Rp {Number(row.price_per_day).toLocaleString('id-ID')} / day</span>
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
      header: "Actions",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            icon={Edit} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onEdit(row)}
            title="Edit Bus" 
          />
          <Button 
            size="sm" 
            variant="danger" 
            icon={Trash2} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onDelete(row)}
            title="Delete Bus"
          />
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
