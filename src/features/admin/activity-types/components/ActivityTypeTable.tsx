import Table from "@/components/ui/Table"
import type { Column } from "@/components/ui/Table"
import Button from "@/components/ui/Button"
import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType"
import { Edit, Trash2, Tag, RotateCcw } from "lucide-react"

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
  const columns: Column<ActivityType>[] = [
    { 
      header: "Activity Type", 
      accessor: (row) => (
        <div className="flex items-center gap-4 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-500 overflow-hidden">
            <Tag size={20} />
          </div>
          <span className="leading-tight font-semibold text-slate-800">{row.name}</span>
        </div>
      )
    },
    {
      header: "Description",
      accessor: (row) => (
        <span className="text-xs text-slate-500 font-medium line-clamp-2 max-w-[300px]">
          {row.description || <span className="italic text-slate-400">No description</span>}
        </span>
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
                title="Restore Activity Type" 
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
                title="Edit Activity Type" 
              />
              <Button 
                size="sm" 
                variant="danger" 
                icon={Trash2} 
                className="h-9 w-9 rounded-full p-0" 
                onClick={() => onDelete(row)}
                title="Delete Activity Type"
              />
            </>
          )}
        </div>
      )
    }
  ]

  return <Table columns={columns} data={data} loading={loading} />
}
