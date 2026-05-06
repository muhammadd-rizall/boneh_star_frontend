import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { Review } from "@/features/admin/reviews/types/Review"
import { Star, Eye, EyeOff, Trash2, RotateCcw, User } from "lucide-react"

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
      header: "Customer", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            {row.customer?.profile_picture ? (
              <img src={row.customer.profile_picture} alt={row.customer.name} className="h-full w-full object-cover" />
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
              className={i < row.rating ? "text-amber-500" : "text-slate-300"}
            />
          ))}
          <span className="ml-1 text-xs font-bold text-slate-700">{row.rating}</span>
        </div>
      )
    },
    {
      header: "Comment",
      accessor: (row) => (
        <div className="max-w-[300px]">
          <p className="text-sm text-slate-600 line-clamp-2 italic">
            "{row.comment || "No comment provided"}"
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
          {row.is_publish ? 'Published' : 'Hidden'}
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
                title="Restore Review" 
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
                variant={row.is_publish ? "ghost" : "outline"} 
                icon={row.is_publish ? EyeOff : Eye} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onTogglePublish(row)}
                title={row.is_publish ? "Hide Review" : "Publish Review"} 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Delete Review"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
