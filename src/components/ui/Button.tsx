import React from "react"
import { Loader2 } from "lucide-react"

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline" | "success"
export type ButtonSize = "xs" | "sm" | "md" | "lg"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ComponentType<{ size?: number | string; className?: string }>
  suffix?: React.ComponentType<{ size?: number | string; className?: string }>
}

function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  icon: Icon,
  suffix: SuffixIcon,
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900 shadow-sm",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-slate-400",
    danger:
      "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500 shadow-sm",
    ghost:
      "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400",
    success:
      "bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500 shadow-sm",
  }

  const sizes: Record<ButtonSize, string> = {
    xs: "px-2.5 py-1.5 text-xs",
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-sm",
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 flex-shrink-0" />
      )}
      {children && <span>{children}</span>}
      {!loading && SuffixIcon && <SuffixIcon className="w-4 h-4 flex-shrink-0" />}
    </button>
  )
}

export default Button
