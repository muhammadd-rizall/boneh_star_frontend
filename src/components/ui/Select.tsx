import React from "react"
import { ChevronDown } from "lucide-react"

type Option = {
  label: string
  value: string
}

interface SelectProps {
  label?: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  error?: string
  hint?: string
  icon?: React.ComponentType<{ size?: number | string; className?: string }>
  placeholder?: string
  className?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

function Select({
  label,
  options,
  value,
  onChange,
  error,
  hint,
  icon: Icon,
  placeholder = "Pilih opsi...",
  className = "",
  id,
  required,
  disabled,
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none">
            <Icon size={16} />
          </div>
        )}

        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={[
            "w-full appearance-none rounded-lg border bg-white py-2.5 pr-9 text-sm text-slate-900 outline-none transition-all duration-150 cursor-pointer",
            Icon ? "pl-9" : "pl-3",
            error
              ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
          ].join(" ")}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-slate-600 transition-colors">
          <ChevronDown size={16} />
        </div>
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

export default Select
