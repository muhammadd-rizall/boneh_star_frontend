import { InboxIcon } from "lucide-react"

type Props = {
  title?: string
  description?: string
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
}

export default function EmptyState({
  title = "Tidak ada data",
  description = "Data belum tersedia atau tidak ditemukan",
  icon: Icon = InboxIcon,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 shadow-inner">
        <Icon size={40} strokeWidth={1.5} className="text-slate-300" />
      </div>
      <h3 className="text-lg font-black tracking-tight text-slate-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm font-semibold text-slate-400 max-w-xs leading-relaxed">{description}</p>
      )}
    </div>
  )
}