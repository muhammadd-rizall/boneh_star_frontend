import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { RouteType } from "@/features/admin/route-types/types/RouteType"
import { Edit, Trash2, Map, RotateCcw } from "lucide-react"
import { useModulePermission } from "@/hooks/useModulePermission"

interface RouteTypeTableProps {
  data: RouteType[]
  onDelete: (routeType: RouteType) => void
  onEdit: (routeType: RouteType) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function RouteTypeTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore,
  loading, 
  isTrash = false 
}: RouteTypeTableProps) {
  const { canUpdate, canDelete } = useModulePermission("routes")

  const columns: Column<RouteType>[] = [
    { 
      header: "Jenis Rute", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            <Map size={20} />
          </div>
          <span className="leading-tight font-semibold text-slate-800">{row.name}</span>
        </div>
      )
    },
    {
      header: "Deskripsi",
      accessor: (row) => (
        <span className="text-xs text-slate-500 font-medium line-clamp-2 max-w-[250px]">
          {row.description || <span className="italic text-slate-400">Tidak ada deskripsi</span>}
        </span>
      )
    },
    {
      header: "Wilayah / Cakupan",
      accessor: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.scope === 'inside' 
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
            : 'bg-amber-50 text-amber-600 border border-amber-100'
        }`}>
          {row.scope === 'inside' ? 'Dalam Kota' : 'Luar Kota'}
        </span>
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
              {canUpdate && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  icon={RotateCcw} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onRestore?.(row.id)}
                  title="Pulihkan Jenis Rute" 
                />
              )}
              {canDelete && (
                <Button 
                  size="sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onDelete(row)}
                  title="Hapus Permanen"
                />
              )}
            </>
          ) : (
            <>
              {canUpdate && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  icon={Edit} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onEdit(row)}
                  title="Edit Jenis Rute" 
                />
              )}
              {canDelete && (
                <Button 
                  size="sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onDelete(row)}
                  title="Hapus Jenis Rute"
                />
              )}
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
