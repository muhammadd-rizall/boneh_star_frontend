import React, { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  icon?: React.ComponentType<{ size?: number | string; className?: string }>
}

function Input({
  label,
  error,
  icon: Icon,
  className = "",
  type = "text",
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState(false)

  // cek apakah password field
  const isPassword = type === "password"

  // type final input
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : type

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {/* ICON KIRI */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Icon size={18} />
          </div>
        )}

        {/* INPUT */}
        <input
          type={inputType}
          className={`
            w-full bg-white border rounded-2xl px-4 py-3 outline-none transition-all duration-200
            ${Icon ? "pl-11" : "pl-4"}
            ${isPassword ? "pr-11" : "pr-4"}
            ${
              error
                ? "border-red-500 ring-red-100 focus:ring-4 text-red-900 placeholder:text-red-300"
                : "border-slate-200 ring-indigo-50 focus:border-indigo-600 focus:ring-4 text-slate-900 placeholder:text-slate-400"
            }
            ${className}
          `}
          {...props}
        />

        {/* 👁️ ICON KANAN KHUSUS PASSWORD */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && (
        <span className="text-red-500 text-xs font-medium ml-1">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input;