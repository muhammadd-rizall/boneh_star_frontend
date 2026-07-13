import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { BusCategory } from "@/features/admin/bus-categories/types/BusCategory"
import { Edit, Trash2, Layout, Users, FileText, RotateCcw } from "lucide-react"

interface BusCategoryTableProps {
  data: BusCategory[]
  onDelete: (category: BusCategory) => void
  onEdit: (category: BusCategory) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function BusCategoryTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore,
  loading, 
  isTrash = false 
}: BusCategoryTableProps) {
  const columns: Column<BusCategory>[] = [
    { 
      header: "Nama Kategori", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            <Layout size={20} />
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.name}</span>
            {row.description && (
              <div className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <FileText size={12} />
                <span className="line-clamp-1">{row.description}</span>
              </div>
            )}
          </div>
        </div>
      )
    },
    { 
      header: "Rentang Kapasitas", 
      accessor: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Users size={14} className="text-slate-400" />
          <span>{row.min_capacity} - {row.max_capacity} Kursi</span>
        </div>
      )
    },
    {
      header: "Dibuat Pada",
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
      header: "Aksi",
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
                title="Pulihkan Kategori" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Hapus Permanen"
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
                title="Edit Kategori" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Hapus Kategori"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
