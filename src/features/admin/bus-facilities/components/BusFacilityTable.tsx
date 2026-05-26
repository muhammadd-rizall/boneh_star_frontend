import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { BusFacility } from "@/features/admin/bus-facilities/types/BusFacility"
import { Edit, Trash2, Shield, RotateCcw } from "lucide-react"

interface BusFacilityTableProps {
  data: BusFacility[]
  onDelete: (facility: BusFacility) => void
  onEdit: (facility: BusFacility) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function BusFacilityTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore,
  loading, 
  isTrash = false 
}: BusFacilityTableProps) {
  const columns: Column<BusFacility>[] = [
    { 
      header: "Facility Name", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            <Shield size={20} />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.name}</span>
          </div>
        </div>
      )
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
                title="Restore Facility" 
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
                title="Edit Facility" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Delete Facility"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
