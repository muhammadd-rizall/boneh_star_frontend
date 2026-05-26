import { AlertTriangle, Info, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"

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
      confirmVariant: "warning" as const,
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
      confirmLabel: confirmText || "OK",
      confirmVariant: "info" as const,
    },
  }

  const { icon: Icon, iconBg, iconColor, confirmLabel, confirmVariant } = config[variant]

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center pt-6 text-center">
        {/* Icon */}
        <div className={`mb-8 flex h-20 w-20 items-center justify-center rounded-3xl ${iconBg} shadow-inner`}>
          <Icon size={36} strokeWidth={1.5} className={iconColor} />
        </div>

        {/* Text */}
        <div className="mb-10">
          <h3 className="text-xl font-black tracking-tight text-slate-950">{title}</h3>
          <p className="mt-3 text-sm font-semibold text-slate-400 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
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
            className="w-full font-bold"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default Confirmation