import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Driver } from "@/features/admin/drivers/types/Driver"
import { Edit, Trash2, UserCircle, RotateCcw, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

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
      header: "Identitas Supir", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left py-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-platinum-tint bg-cloud-mist text-slate-blue overflow-hidden shadow-sm">
            {row.photo ? (
              <img 
                src={row.photo} 
                alt={row.name} 
                className="h-full w-full object-cover transition-transform hover:scale-110 duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?background=0B3558&color=fff&name=' + encodeURIComponent(row.name);
                }}
              />
            ) : (
              <UserCircle size={24} className="text-platinum-tint" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-bold text-midnight-indigo">{row.name}</span>
            <span className="text-[11px] font-medium text-slate-blue opacity-60 line-clamp-1 max-w-[180px]">{row.address}</span>
          </div>
        </div>
      )
    },
    {
      header: "Kontak",
      accessor: (row) => (
        <div className="flex items-center gap-2.5 text-slate-blue font-semibold opacity-85">
          <Phone size={14} className="text-action-blue" />
          <span className="text-sm tracking-tight">{row.phone}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => {
        const styles = {
          available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          on_duty: 'bg-blue-50 text-blue-700 border-blue-200',
          inactive: 'bg-slate-50 text-slate-500 border-slate-200'
        }
        const labels = {
          available: 'Tersedia',
          on_duty: 'Bertugas',
          inactive: 'Nonaktif'
        }
        return (
          <span className={cn(
            "inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] border shadow-sm",
            styles[row.status] || styles.inactive
          )}>
            {labels[row.status] || row.status}
          </span>
        )
      }
    },
    {
      header: "Terdaftar",
      accessor: (row) => (
        <span className="text-xs text-slate-blue font-semibold opacity-70">
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
                size="icon-sm" 
                variant="outline" 
                icon={RotateCcw} 
                className="h-9 w-9 rounded-xl shadow-sm hover:border-blue-500 hover:text-blue-500" 
                onClick={() => onRestore?.(row.id)}
                title="Pulihkan Supir" 
              />
              <Button 
                size="icon-sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-xl shadow-sm" 
                onClick={() => onDelete(row)}
                title="Hapus Permanen"
              />
            </>
          ) : (
            <>
              <Button 
                size="icon-sm" 
                variant="outline" 
                icon={Edit} 
                className="h-9 w-9 rounded-xl shadow-sm hover:border-action-blue hover:text-action-blue" 
                onClick={() => onEdit(row)}
                title="Edit Supir" 
              />
              <Button 
                size="icon-sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-xl shadow-sm" 
                onClick={() => onDelete(row)}
                title="Hapus Supir"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
