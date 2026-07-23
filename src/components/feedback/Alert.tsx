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
  { icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>; bg: string; border: string; text: string; iconColor: string }
> = {
  success: {
    icon: CheckCircle2,
    bg: "bg-glacier-blue/5",
    border: "border-glacier-blue/20",
    text: "text-glacier-blue",
    iconColor: "text-glacier-blue",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-500/5",
    border: "border-red-500/20",
    text: "text-red-600",
    iconColor: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-sunset-gold/5",
    border: "border-sunset-gold/20",
    text: "text-sunset-gold",
    iconColor: "text-sunset-gold",
  },
  info: {
    icon: Info,
    bg: "bg-cloud-mist",
    border: "border-platinum-tint",
    text: "text-midnight-indigo",
    iconColor: "text-action-blue",
  },
}

export default function Alert({ message, variant = "info", dismissible = false, title }: Props) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const { icon: Icon, bg, border, text, iconColor } = config[variant]

  return (
    <div className={`flex items-start gap-4 rounded-xl border ${bg} ${border} p-5 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${iconColor}`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        {title && <p className={`text-sm font-bold uppercase tracking-wider ${text} mb-1`}>{title}</p>}
        <p className={`text-sm font-medium leading-relaxed ${text} opacity-80`}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className={`flex-shrink-0 rounded-lg p-2 transition-all ${text} opacity-40 hover:bg-white hover:opacity-100 active:scale-95`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}