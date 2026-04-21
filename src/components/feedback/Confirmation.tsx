import { AlertTriangle, Info, HelpCircle } from "lucide-react"
import Button from "@/components/ui/Button"

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
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
      confirmLabel: confirmText || "Lanjutkan",
      confirmVariant: "primary" as const,
    },
    info: {
      icon: Info,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
      confirmLabel: confirmText || "OK",
      confirmVariant: "primary" as const,
    },
  }

  const { icon: Icon, iconBg, iconColor, confirmLabel, confirmVariant } = config[variant]

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        {/* Icon */}
        <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon size={22} className={iconColor} />
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2">
          <Button
            variant={confirmVariant}
            className="w-full"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
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