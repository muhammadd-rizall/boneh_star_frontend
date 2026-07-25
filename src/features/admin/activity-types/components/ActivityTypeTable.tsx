import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType"
import { Edit, FileText, ImageIcon, RotateCcw, Tag, Trash2 } from "lucide-react"
import { useModulePermission } from "@/hooks/useModulePermission"

interface ActivityTypeTableProps {
  data: ActivityType[]
  onDelete: (activityType: ActivityType) => void
  onEdit: (activityType: ActivityType) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function ActivityTypeTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore,
  loading, 
  isTrash = false 
}: ActivityTypeTableProps) {
  const { canUpdate, canDelete } = useModulePermission("activities")

  const columns: Column<ActivityType>[] = [
    { 
      header: "Jenis Aktivitas",
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-platinum-tint bg-cloud-mist text-slate-blue">
            {row.image_url ? (
              <img src={row.image_url} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <Tag size={20} />
            )}
          </div>
          <div className="min-w-0">
            <span className="block truncate leading-tight font-semibold text-midnight-indigo">
              {row.name}
            </span>
            {row.description && (
              <div className="mt-1 flex max-w-[360px] items-center gap-1.5 text-xs font-medium text-slate-blue">
                <FileText size={12} className="shrink-0 text-steel-gray" />
                <span className="line-clamp-1">{row.description}</span>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      header: "Media",
      accessor: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
          row.image_url
            ? "border-emerald-100 bg-emerald-50 text-emerald-600"
            : "border-slate-200 bg-slate-50 text-slate-500"
        }`}>
          <ImageIcon size={12} />
          {row.image_url ? "Ada Gambar" : "Tanpa Gambar"}
        </span>
      )
    },
    {
      header: "Dibuat",
      accessor: (row) => (
        <span className="whitespace-nowrap text-xs font-medium text-slate-blue">
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
                  title="Pulihkan jenis aktivitas"
                />
              )}
              {canDelete && (
                <Button 
                  size="sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onDelete(row)}
                  title="Hapus permanen"
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
                  title="Edit jenis aktivitas"
                />
              )}
              {canDelete && (
                <Button 
                  size="sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-full p-0" 
                  onClick={() => onDelete(row)}
                  title="Hapus jenis aktivitas"
                />
              )}
            </>
          )}
        </div>
      )
    }
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage={isTrash ? "Tidak ada jenis aktivitas di sampah" : "Belum ada jenis aktivitas"}
      paginated
    />
  )
}
