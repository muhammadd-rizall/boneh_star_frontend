import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  hint?: string
  icon?: React.ComponentType<{ size?: number | string; className?: string }>
}

function Input({
  label,
  error,
  hint,
  icon: Icon,
  className = "",
  type = "text",
  id,
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none">
            <Icon size={16} />
          </div>
        )}

        <input
          id={inputId}
          type={inputType}
          className={[
            "w-full rounded-lg border bg-white py-2.5 text-sm text-slate-900 outline-none transition-all duration-150",
            "placeholder:text-slate-400",
            Icon ? "pl-9" : "pl-3",
            isPassword ? "pr-9" : "pr-3",
            error
              ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
            className,
          ].join(" ")}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
          <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  )
}

export default Input
