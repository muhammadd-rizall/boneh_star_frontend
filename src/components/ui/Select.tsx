import React from "react"
import { ChevronDown, } from "lucide-react"

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
  icon?: React.ComponentType<{ size?: number | string; className?: string }>
  placeholder?: string
  className?: string
}

function Select({
  label,
  options,
  value,
  onChange,
  error,
  icon: Icon,
  placeholder = "Select an option",
  className = "",
}: SelectProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
            <Icon size={18} />
          </div>
        )}

        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full appearance-none bg-white border rounded-2xl px-4 py-3 outline-none transition-all duration-200 cursor-pointer
            ${Icon ? "pl-11" : "pl-4"}
            ${error 
              ? "border-red-500 ring-red-100 focus:ring-4" 
              : "border-slate-200 ring-indigo-50 focus:border-indigo-600 focus:ring-4"}
          `}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors">
          <ChevronDown size={18} />
        </div>
      </div>

      {error && (
        <span className="text-red-500 text-xs font-medium ml-1">
          {error}
        </span>
      )}
    </div>
  )
}

export default Select;