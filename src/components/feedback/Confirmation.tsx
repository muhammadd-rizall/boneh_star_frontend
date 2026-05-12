import { AlertTriangle, Info, HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface ConfirmationProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
  variant?: "danger" | "warning" | "info"
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

function Confirmation({
  open,
  onClose,
  onConfirm,
  title = "Apakah anda yakin?",
  message,
  variant = "danger",
  confirmText,
  cancelText = "Batal",
  loading = false,
}: ConfirmationProps) {
  if (!open) return null

  const config = {
    danger: {
      icon: AlertTriangle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-500",
      confirmLabel: confirmText || "Ya, Hapus",
      confirmVariant: "danger" as const,
    },
    warning: {
      icon: HelpCircle,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      confirmLabel: confirmText || "Lanjutkan",
      confirmVariant: "primary" as const,
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      confirmLabel: confirmText || "OK",
      confirmVariant: "primary" as const,
    },
  }

  const { icon: Icon, iconBg, iconColor, confirmLabel, confirmVariant } = config[variant]

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-300"
        onClick={!loading ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
          disabled={loading}
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl ${iconBg} shadow-inner`}>
          <Icon size={36} strokeWidth={1.5} className={iconColor} />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-xl font-black tracking-tight text-slate-950">{title}</h3>
          <p className="mt-3 text-sm font-semibold text-slate-400 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3">
          <Button
            variant={confirmVariant}
            size="lg"
            className="w-full shadow-lg shadow-slate-200"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full font-bold"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Confirmation