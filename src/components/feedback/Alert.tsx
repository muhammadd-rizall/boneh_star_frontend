import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react"
import React, { useState } from "react"

type Variant = "success" | "error" | "info" | "warning"

type Props = {
  message: string
  variant?: Variant
  dismissible?: boolean
  title?: string
}

const config: Record<
  Variant,
  { icon: React.ComponentType<{ size?: number; className?: string }>; bg: string; border: string; text: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-800",
    iconColor: "text-rose-500",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
    iconColor: "text-amber-500",
  },
  info: {
    icon: Info,
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-800",
    iconColor: "text-sky-500",
  },
}

export default function Alert({ message, variant = "info", dismissible = false, title }: Props) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const { icon: Icon, bg, border, text, iconColor } = config[variant]

  return (
    <div className={`flex items-start gap-3 rounded-xl border ${bg} ${border} px-4 py-3`}>
      <Icon size={16} className={`mt-0.5 flex-shrink-0 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        {title && <p className={`text-sm font-semibold ${text}`}>{title}</p>}
        <p className={`text-sm leading-relaxed ${text} ${title ? "mt-0.5 opacity-80" : ""}`}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className={`flex-shrink-0 rounded-lg p-0.5 transition-colors ${text} opacity-60 hover:opacity-100`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}