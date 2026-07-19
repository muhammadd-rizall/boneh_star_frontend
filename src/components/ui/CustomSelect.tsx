import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { cn } from "@/lib/utils"

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
  icon?: React.ElementType
  placeholder?: string
  className?: string
  id?: string
  required?: boolean
  disabled?: boolean
}

export function CustomSelect({
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
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)
  
  // Find the label for the current value to ensure it's displayed correctly
  const selectedOption = options.find(opt => String(opt.value) === String(value));
  const displayLabel = selectedOption ? selectedOption.label : "";

  return (
    <div className={cn("flex flex-col gap-2 w-full text-left", className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[13px] font-bold text-midnight-indigo ml-0.5 uppercase tracking-wider opacity-90"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-blue group-focus-within:text-action-blue transition-colors pointer-events-none z-10">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        <Select value={value} onValueChange={(val) => onChange(val ?? "")} disabled={disabled}>
          <SelectTrigger
            id={selectId}
            className={cn(
              "w-full rounded-lg border bg-white py-3 pr-11 text-sm font-medium text-midnight-indigo shadow-sm outline-none transition-all duration-150 h-auto",
              Icon ? "pl-11" : "pl-4",
              error
                ? "border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-platinum-tint focus:border-action-blue focus:ring-4 focus:ring-action-blue/10 focus:bg-white hover:border-slate-blue/30"
            )}
          >
            <SelectValue placeholder={placeholder}>
              {displayLabel}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <p className="text-xs font-bold text-red-500 flex items-center gap-1.5 ml-0.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs font-medium text-slate-blue ml-0.5 opacity-70">{hint}</p>
      )}
    </div>
  )
}
