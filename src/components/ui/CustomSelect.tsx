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

  return (
    <div className={cn("flex flex-col gap-2 w-full text-left", className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            id={selectId}
            className={cn(
              "w-full appearance-none rounded-2xl border bg-white py-3.5 pr-11 text-sm font-bold text-slate-700 outline-none transition-all duration-200 cursor-pointer h-auto",
              Icon ? "pl-11" : "pl-4",
              error
                ? "border-rose-200 bg-rose-50/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
                : "border-slate-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white"
            )}
          >
            <SelectValue placeholder={placeholder} />
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
