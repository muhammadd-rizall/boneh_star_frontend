import { InboxIcon } from "lucide-react"

type Props = {
  title?: string
  description?: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

export default function EmptyState({
  title = "Tidak ada data",
  description = "Data belum tersedia atau tidak ditemukan",
  icon: Icon = InboxIcon,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Icon size={24} className="text-slate-300" />
      </div>
      <h3 className="text-sm font-semibold text-slate-600">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">{description}</p>
      )}
    </div>
  )
}