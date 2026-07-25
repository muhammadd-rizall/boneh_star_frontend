import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Bus } from "@/features/admin/buses/types/Bus"
import { Edit, Trash2, Bus as BusIcon, Hash, Users, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useModulePermission } from "@/hooks/useModulePermission"

interface BusTableProps {
  data: Bus[]
  onDelete: (bus: Bus) => void
  onEdit: (bus: Bus) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

const statusConfig = {
  available: { label: 'Tersedia', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  booked: { label: 'Dipesan', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  maintenance: { label: 'Perawatan', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  inactive: { label: 'Nonaktif', color: 'bg-slate-50 text-slate-700 border-slate-200' },
}

export default function BusTable({ data, onDelete, onEdit, onRestore, loading, isTrash = false }: BusTableProps) {
  const { canUpdate, canDelete } = useModulePermission("buses")

  const columns: Column<Bus>[] = [
    { 
      header: "Identitas Bus", 
      accessor: (row) => {
        const primaryImage = row.images?.find(img => img.is_primary) || row.images?.[0];
        return (
          <div className="flex items-center gap-4 text-left py-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-platinum-tint bg-cloud-mist overflow-hidden shadow-sm">
              {primaryImage ? (
                <img src={primaryImage.url} alt={row.name} className="h-full w-full object-cover transition-transform hover:scale-110 duration-500" />
              ) : (
                <BusIcon size={24} className="text-platinum-tint" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="leading-tight font-bold text-midnight-indigo">{row.name}</span>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-blue opacity-70">
                <Hash size={12} />
                <span>{row.plat_number}</span>
              </div>
            </div>
          </div>
        )
      }
    },
    { 
      header: "Kategori & Kapasitas", 
      accessor: (row) => (
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-action-blue bg-blue-50 px-2.5 py-1 rounded-lg w-fit border border-blue-100">
            {row.category?.name || 'Tanpa Kategori'}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-blue font-semibold opacity-85">
            <Users size={14} className="text-action-blue" />
            <span>{row.seat_count} Kursi</span>
          </div>
        </div>
      )
    },
    {
      header: "Fasilitas",
      accessor: (row) => (
        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
          {row.facilities && row.facilities.length > 0 ? (
            row.facilities.slice(0, 3).map((facility) => (
              <span 
                key={facility.id} 
                className="inline-flex items-center rounded-lg bg-cloud-mist px-2.5 py-1 text-[10px] font-semibold text-slate-blue border border-platinum-tint/50"
              >
                {facility.name}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-medium italic text-slate-blue opacity-40">Tidak ada fasilitas</span>
          )}
          {(row.facilities?.length || 0) > 3 && (
            <span className="inline-flex items-center rounded-lg bg-platinum-tint/20 px-2.5 py-1 text-[10px] font-semibold text-slate-blue">
              +{(row.facilities?.length || 0) - 3}
            </span>
          )}
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const config = statusConfig[row.status] || statusConfig.inactive;
        return (
          <span className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border shadow-sm",
            config.color
          )}>
            {config.label}
          </span>
        )
      }
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          {isTrash ? (
            <>
              {canUpdate && (
                <Button 
                  size="icon-sm" 
                  variant="outline" 
                  icon={RotateCcw} 
                  className="h-9 w-9 rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-500" 
                  onClick={() => onRestore?.(row.id)}
                  title="Pulihkan Bus" 
                />
              )}
              {canDelete && (
                <Button 
                  size="icon-sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-xl shadow-sm" 
                  onClick={() => onDelete(row)}
                  title="Hapus Permanen"
                />
              )}
            </>
          ) : (
            <>
              {canUpdate && (
                <Button 
                  size="icon-sm" 
                  variant="outline" 
                  icon={Edit} 
                  className="h-9 w-9 rounded-xl shadow-sm hover:border-action-blue hover:text-action-blue" 
                  onClick={() => onEdit(row)}
                  title="Edit Bus" 
                />
              )}
              {canDelete && (
                <Button 
                  size="icon-sm" 
                  variant="danger" 
                  icon={Trash2} 
                  className="h-9 w-9 rounded-xl shadow-sm" 
                  onClick={() => onDelete(row)}
                  title="Hapus Bus"
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
