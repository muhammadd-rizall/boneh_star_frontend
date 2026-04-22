import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { Bus } from "@/features/admin/buses/types/Bus"
import { Edit, Trash2, Bus as BusIcon, Calendar, Hash, Users, RotateCcw } from "lucide-react"

interface BusTableProps {
  data: Bus[]
  onDelete: (bus: Bus) => void
  onEdit: (bus: Bus) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

const statusConfig = {
  available: { label: 'Available', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  booked: { label: 'Booked', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  maintenance: { label: 'Maintenance', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  inactive: { label: 'Inactive', color: 'bg-slate-50 text-slate-700 border-slate-200' },
}

export default function BusTable({ data, onDelete, onEdit, onRestore, loading, isTrash = false }: BusTableProps) {
  const columns: Column<Bus>[] = [
    { 
      header: "Bus Identity", 
      accessor: (row) => {
        const primaryImage = row.images?.find(img => img.is_primary) || row.images?.[0];
        return (
          <div className="flex items-center gap-4 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              {primaryImage ? (
                <img src={primaryImage.url} alt={row.name} className="h-full w-full object-cover" />
              ) : (
                <BusIcon size={24} className="text-slate-400" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-bold text-slate-900">{row.name}</span>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Hash size={12} />
                <span>{row.plat_number}</span>
              </div>
            </div>
          </div>
        )
      }
    },
    { 
      header: "Category & Capacity", 
      accessor: (row) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">
            {row.category?.name || 'Uncategorized'}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <Users size={14} className="text-slate-400" />
            <span>{row.seat_count} Seats</span>
          </div>
        </div>
      )
    },
    {
      header: "Facilities",
      accessor: (row) => (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {row.facilities && row.facilities.length > 0 ? (
            row.facilities.map((facility) => (
              <span 
                key={facility.id} 
                className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200"
              >
                {facility.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] italic text-slate-400">No facilities</span>
          )}
        </div>
      )
    },
    { 
      header: "Year", 
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Calendar size={14} className="text-slate-400" />
          <span>{row.production_year}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const config = statusConfig[row.status];
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
            {config.label}
          </span>
        )
      }
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
                title="Restore Bus" 
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
            </>
          )}
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
