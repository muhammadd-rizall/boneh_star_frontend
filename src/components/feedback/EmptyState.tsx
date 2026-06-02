import { InboxIcon } from "lucide-react"

type Props = {
  title?: string
  description?: string
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>
}

export default function EmptyState({
  title = "Tidak ada data",
  description = "Data belum tersedia atau tidak ditemukan dalam pencarian Anda",
  icon: Icon = InboxIcon,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[32px] bg-cloud-mist border border-platinum-tint shadow-sm">
        <Icon size={48} strokeWidth={1.5} className="text-platinum-tint" />
      </div>
      <h3 className="text-xl font-bold tracking-tight text-midnight-indigo">{title}</h3>
      {description && (
        <p className="mt-3 text-base font-medium text-slate-blue opacity-60 max-w-sm leading-relaxed">{description}</p>
      )}
    </div>
  )
}