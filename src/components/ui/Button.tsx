import React from "react"
import { Loader2 } from "lucide-react"

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline"
export type ButtonSize = "sm" | "md" | "lg"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ComponentType<{ size?: number | string, className?: string }>
}

function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  icon: Icon,
  className = "",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none shadow-sm cursor-pointer"

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 shadow-lg shadow-indigo-100",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-red-200",
    ghost: "text-slate-600 hover:bg-slate-100 shadow-none",
    outline: "border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50",
  }

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      <span>{loading ? "Please wait..." : children}</span>
    </button>
  )
}

export default Button;