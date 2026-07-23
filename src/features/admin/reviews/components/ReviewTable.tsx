import { DataTable } from "@/components/ui/DataTable"
import type { Column } from "@/components/ui/DataTable"
import { Button } from "@/components/ui/Button"
import type { Review } from "@/features/admin/reviews/types/Review"
import { Star, Eye, EyeOff, Trash2, RotateCcw, User } from "lucide-react"

import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils"

interface ReviewTableProps {
  data: Review[]
  onTogglePublish: (review: Review) => void
  onDelete: (review: Review) => void
  onRestore?: (id: string) => void
  loading?: boolean
  isTrash?: boolean
}

export default function ReviewTable({ 
  data, 
  onTogglePublish,
  onDelete, 
  onRestore,
  loading, 
  isTrash = false 
}: ReviewTableProps) {
  const columns: Column<Review>[] = [
    { 
      header: "Pelanggan", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            {row.customer?.profile_picture && resolveMediaUrl(row.customer.profile_picture) ? (
              <img 
                src={resolveMediaUrl(row.customer.profile_picture)} 
                alt={row.customer.name} 
                className="h-full w-full object-cover" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <User size={20} />
            )}
          </div>
          <div className="flex flex-col">
            <span className="leading-tight font-semibold text-slate-800">{row.customer?.name}</span>
            <span className="text-xs text-slate-500">{row.booking?.booking_code}</span>
          </div>
        </div>
      )
    },
    {
      header: "Rating",
      accessor: (row) => (
        <div className="flex items-center gap-1 text-amber-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              fill={i < row.rating ? "currentColor" : "none"} 
              className={i < row.rating ? "text-amber-500 animate-pulse" : "text-slate-300"}
            />
          ))}
          <span className="ml-1 text-xs font-bold text-slate-700">{row.rating}</span>
        </div>
      )
    },
    {
      header: "Ulasan",
      accessor: (row) => (
        <div className="max-w-[300px]">
          <p className="text-sm text-slate-600 line-clamp-2 italic">
            "{row.comment || "Tidak ada komentar"}"
          </p>
        </div>
      )
    },
    {
      header: "Status",
      accessor: (row) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.is_publish ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
        }`}>
          {row.is_publish ? 'Dipublikasikan' : 'Disembunyikan'}
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
                title="Pulihkan Ulasan" 
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
                variant={row.is_publish ? "ghost" : "outline"} 
                icon={row.is_publish ? EyeOff : Eye} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onTogglePublish(row)}
                title={row.is_publish ? "Sembunyikan Ulasan" : "Tampilkan Ulasan"} 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Hapus Ulasan"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <DataTable columns={columns} data={data} loading={loading} paginated />
}
