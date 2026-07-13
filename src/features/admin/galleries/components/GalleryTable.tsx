import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Gallery } from "../types/Gallery"
import { Edit, Trash2, Image as ImageIcon } from "lucide-react"

interface GalleryTableProps {
  data: Gallery[]
  onDelete: (gallery: Gallery) => void
  onEdit: (gallery: Gallery) => void
  onTogglePublish?: (gallery: Gallery) => void
  loading?: boolean
}

export default function GalleryTable({ 
  data, 
  onDelete, 
  onEdit, 
  onTogglePublish,
  loading, 
}: GalleryTableProps) {
  const columns: Column<Gallery>[] = [
    { 
      header: "Acara Galeri", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden flex-shrink-0">
            {row.image_urls && row.image_urls.length > 0 ? (
              <img src={row.image_urls[0]} alt={row.title} className="h-full w-full object-cover" />
            ) : (
              <ImageIcon size={20} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.title}</span>
            <span className="text-xs text-slate-500 font-medium">
              {row.images?.length || 0} Foto
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Tanggal",
      accessor: (row) => (
        <span className="text-sm text-slate-600 font-medium">
          {row.date ? new Date(row.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }) : '-'}
        </span>
      )
    },
    {
      header: "Dipublikasikan",
      accessor: (row) => (
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.is_publish}
              onChange={() => onTogglePublish?.(row)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-action-blue/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-action-blue"></div>
          </label>
        </div>
      )
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            icon={Edit} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onEdit(row)}
            title="Edit Galeri" 
          />
          <Button 
            size="sm" 
            variant="danger" 
            icon={Trash2} 
            className="h-9 w-9 rounded-full p-0" 
            onClick={() => onDelete(row)}
            title="Hapus Galeri"
          />
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
