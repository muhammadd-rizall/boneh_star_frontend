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
    bg: "bg-emerald-50/50",
    border: "border-emerald-100",
    text: "text-emerald-900",
    iconColor: "text-emerald-600",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-rose-50/50",
    border: "border-rose-100",
    text: "text-rose-900",
    iconColor: "text-rose-600",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-orange-50/50",
    border: "border-orange-100",
    text: "text-orange-900",
    iconColor: "text-orange-600",
  },
  info: {
    icon: Info,
    bg: "bg-slate-50",
    border: "border-slate-100",
    text: "text-slate-900",
    iconColor: "text-slate-600",
  },
}

export default function Alert({ message, variant = "info", dismissible = false, title }: Props) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null

  const { icon: Icon, bg, border, text, iconColor } = config[variant]

  return (
    <div className={`flex items-start gap-4 rounded-2xl border ${bg} ${border} p-4 animate-in fade-in slide-in-from-top-2 duration-300`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ${iconColor}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0 py-0.5">
        {title && <p className={`text-sm font-black uppercase tracking-widest ${text} mb-1`}>{title}</p>}
        <p className={`text-sm font-semibold leading-relaxed ${text} opacity-70`}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className={`flex-shrink-0 rounded-xl p-1.5 transition-all ${text} opacity-40 hover:bg-white hover:opacity-100 active:scale-90`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}