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
      iconBg: "bg-red-500/5",
      iconColor: "text-red-600",
      confirmLabel: confirmText || "Ya, Hapus",
      confirmVariant: "danger" as const,
    },
    warning: {
      icon: HelpCircle,
      iconBg: "bg-sunset-gold/5",
      iconColor: "text-sunset-gold",
      confirmLabel: confirmText || "Lanjutkan",
      confirmVariant: "warning" as const,
    },
    info: {
      icon: Info,
      iconBg: "bg-glacier-blue/5",
      iconColor: "text-glacier-blue",
      confirmLabel: confirmText || "OK",
      confirmVariant: "info" as const,
    },
  }

  const { icon: Icon, iconBg, iconColor, confirmLabel, confirmVariant } = config[variant]

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center pt-6 text-center">
        {/* Icon */}
        <div className={`mb-8 flex h-24 w-24 items-center justify-center rounded-3xl ${iconBg} shadow-sm border border-platinum-tint/20`}>
          <Icon size={40} strokeWidth={2} className={iconColor} />
        </div>

        {/* Text */}
        <div className="mb-10">
          <h3 className="text-2xl font-bold tracking-tight text-midnight-indigo">{title}</h3>
          <p className="mt-4 text-base font-medium text-slate-blue leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          <Button
            variant={confirmVariant}
            size="lg"
            className="w-full font-bold h-14 rounded-xl"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full font-bold h-14 rounded-xl text-slate-blue hover:text-midnight-indigo"
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