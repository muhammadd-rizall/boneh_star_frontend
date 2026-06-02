import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Customer } from "@/features/admin/customers/types/Customer"
import { Edit, Trash2, Mail, Phone, MapPin, User as UserIcon, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomerTableProps {
  data: Customer[]
  onDelete: (customer: Customer) => void
  onEdit: (customer: Customer) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function CustomerTable({ 
  data, 
  onDelete, 
  onEdit, 
  onRestore, 
  loading, 
  isTrash = false 
}: CustomerTableProps) {
  const columns: Column<Customer>[] = [
    { 
      header: "Identitas Pelanggan", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left py-1">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-platinum-tint bg-cloud-mist text-slate-blue overflow-hidden shadow-sm">
            {row.profile_picture ? (
              <img 
                src={row.profile_picture} 
                alt={row.name} 
                className="h-full w-full object-cover transition-transform hover:scale-110 duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?background=0B3558&color=fff&name=' + encodeURIComponent(row.name);
                }}
              />
            ) : (
              <UserIcon size={24} strokeWidth={2.5} className="text-action-blue" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-bold text-midnight-indigo">{row.name}</span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-blue opacity-60">
              <Mail size={12} />
              <span>{row.email}</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: "Kontak & Alamat", 
      accessor: (row) => (
        <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-blue">
          <div className="flex items-center gap-2 opacity-80">
            <Phone size={14} className="text-action-blue" />
            <span>{row.phone || "—"}</span>
          </div>
          <div className="flex items-center gap-2 max-w-[200px] truncate opacity-70">
            <MapPin size={14} className="text-action-blue" />
            <span>{row.address || "—"}</span>
          </div>
        </div>
      )
    },
    {
      header: "Status Akun",
      accessor: (row) => (
        <span className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] border shadow-sm",
          row.is_active 
            ? "border-emerald-200 bg-emerald-50 text-emerald-700" 
            : "border-slate-200 bg-slate-100 text-slate-500"
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", row.is_active ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
          {row.is_active ? "Aktif" : "Nonaktif"}
        </span>
      )
    },
    {
      header: "Bergabung",
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
                title="Pulihkan Pelanggan" 
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
                title="Edit Pelanggan" 
              />
              <Button 
                size="icon-sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-xl shadow-sm" 
                onClick={() => onDelete(row)}
                title="Hapus Pelanggan"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
