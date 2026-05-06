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
  icon?: React.ComponentType<{ size?: number | string; className?: string; strokeWidth?: number }>
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
    <div className={`flex flex-col gap-2 w-full text-left ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          className={[
            "w-full appearance-none rounded-2xl border bg-white py-3.5 pr-11 text-sm font-bold text-slate-700 outline-none transition-all duration-200 cursor-pointer",
            Icon ? "pl-11" : "pl-4",
            error
              ? "border-rose-200 bg-rose-50/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              : "border-slate-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white",
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

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors">
          <ChevronDown size={18} strokeWidth={2} />
        </div>
      </div>

      {error && (
        <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1.5 ml-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-[10px] font-bold text-slate-400 ml-1">{hint}</p>
      )}
    </div>
  )
}

export default Select
