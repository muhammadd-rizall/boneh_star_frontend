import React from "react"
import { Loader2 } from "lucide-react"

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline" | "success"
export type ButtonSize = "xs" | "sm" | "md" | "lg"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ComponentType<{ size?: any; className?: string }>
  suffix?: React.ComponentType<{ size?: any; className?: string }>
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
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-950 shadow-sm shadow-slate-200",
    secondary:
      "bg-orange-50 text-orange-600 hover:bg-orange-100 focus-visible:ring-orange-200",
    danger:
      "bg-rose-50 text-rose-600 hover:bg-rose-100 focus-visible:ring-rose-200",
    ghost:
      "text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-slate-200",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-200",
    success:
      "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus-visible:ring-emerald-200",
  }

  const sizes: Record<ButtonSize, string> = {
    xs: "px-3 py-1.5 text-xs",
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
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
