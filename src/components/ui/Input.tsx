import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatDateDMY } from "@/utils/formatter"

interface InputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ElementType
}

function Input({
  className,
  type = "text",
  label,
  error,
  hint,
  icon: Icon,
  id,
  placeholder,
  value,
  onChange,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = type === "password"
  const isDate = type === "date"
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

  if (isDate) {
    return (
      <div className="flex flex-col gap-2 w-full text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-semibold text-midnight-indigo ml-0.5 uppercase tracking-wider opacity-90"
          >
            {label}
          </label>
        )}

        <div className="relative group min-h-[46px]">
          {/* Real hidden date input */}
          <InputPrimitive
            id={inputId}
            type="date"
            data-slot="input"
            value={value}
            onChange={onChange}
            onClick={(e) => {
              try {
                e.currentTarget.showPicker()
              } catch (err) {}
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 peer"
            {...props}
          />

          {/* Styled display replica */}
          <div
            className={cn(
              "w-full rounded-lg border bg-white py-3 text-sm font-medium text-midnight-indigo outline-none transition-all duration-150 flex items-center min-h-[46px] shadow-sm",
              Icon ? "pl-11" : "pl-4",
              "pr-4",
              "border-platinum-tint peer-focus:border-action-blue peer-focus:ring-4 peer-focus:ring-action-blue/10 peer-focus:bg-white hover:border-slate-blue/30",
              "peer-disabled:bg-slate-50/50 peer-disabled:text-slate-400/70 peer-disabled:cursor-not-allowed peer-disabled:border-platinum-tint/50",
              error ? "border-red-300 bg-red-50/20 peer-focus:border-red-500 peer-focus:ring-4 peer-focus:ring-red-500/10" : "",
              className
            )}
          >
            {Icon && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-blue peer-focus:text-action-blue transition-colors pointer-events-none">
                <Icon size={18} strokeWidth={2} />
              </div>
            )}
            <span className={cn(value ? "text-midnight-indigo font-semibold" : "text-steel-gray font-normal")}>
              {value ? formatDateDMY(value as string) : (placeholder || "Pilih tanggal")}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-xs font-semibold text-red-500 ml-0.5">{error}</p>
        )}
        {!error && hint && (
          <p className="text-xs font-normal text-slate-blue ml-0.5 opacity-70">{hint}</p>
        )}
      </div>
    )
  }

  // Non-date inputs
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[13px] font-semibold text-midnight-indigo ml-0.5 uppercase tracking-wider opacity-90"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-blue group-focus-within:text-action-blue transition-colors pointer-events-none">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        <InputPrimitive
          id={inputId}
          type={inputType}
          data-slot="input"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={cn(
            "w-full rounded-lg border bg-white py-3 text-sm font-medium text-midnight-indigo outline-none transition-all duration-150",
            "placeholder:text-steel-gray placeholder:font-normal",
            Icon ? "pl-11" : "pl-4",
            isPassword ? "pr-11" : "pr-4",
            error
              ? "border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-platinum-tint focus:border-action-blue focus:ring-4 focus:ring-action-blue/10 focus:bg-white hover:border-slate-blue/30 shadow-sm",
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-blue hover:text-midnight-indigo transition-colors"
          >
            {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-500 ml-0.5">{error}</p>
      )}
      {!error && hint && (
        <p className="text-xs font-normal text-slate-blue ml-0.5 opacity-70">{hint}</p>
      )}
    </div>
  )
}

export { Input }
