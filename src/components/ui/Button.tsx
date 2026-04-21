import React from "react"
import { Loader2 } from "lucide-react"

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline"
export type ButtonSize = "sm" | "md" | "lg"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ComponentType<{ size?: number | string, className?: string }>
  suffix?: React.ComponentType<{ size?: number | string, className?: string }>
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
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer border"

  const variants: Record<ButtonVariant, string> = {
    primary: "border-slate-900 bg-slate-900 text-white hover:bg-slate-800 hover:border-slate-800 shadow-[0_16px_30px_-22px_rgba(15,23,42,0.9)]",
    secondary: "border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200",
    danger: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
    ghost: "border-transparent bg-transparent text-slate-600 hover:bg-slate-100",
    outline: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  }

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
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
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{children}</span>
      {!loading && SuffixIcon && <SuffixIcon className="w-4 h-4" />}
    </button>
  )
}

export default Button;
