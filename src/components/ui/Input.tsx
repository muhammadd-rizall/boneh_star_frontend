import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

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
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (showPassword ? "text" : "password") : type
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

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
