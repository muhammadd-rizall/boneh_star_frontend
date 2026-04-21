import { AlertCircle, RefreshCcw } from "lucide-react"

type Props = {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({
  message = "Terjadi kesalahan. Silakan coba lagi.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
        <AlertCircle size={24} className="text-rose-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-700">Gagal memuat data</h3>
      <p className="mt-1 text-xs text-slate-400 max-w-xs leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
        >
          <RefreshCcw size={13} />
          Coba Lagi
        </button>
      )}
    </div>
  )
}