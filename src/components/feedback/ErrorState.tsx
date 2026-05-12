import { AlertCircle, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/Button"

type Props = {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = "Terjadi kesalahan. Silakan coba lagi.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-rose-50 shadow-inner">
        <AlertCircle size={40} strokeWidth={1.5} className="text-rose-400" />
      </div>
      <h3 className="text-lg font-black tracking-tight text-slate-900">Gagal memuat data</h3>
      <p className="mt-2 text-sm font-semibold text-slate-400 max-w-xs leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="mt-8 rounded-xl border-slate-100 font-bold"
          icon={RefreshCcw}
        >
          Coba Lagi
        </Button>
      )}
    </div>
  )
}