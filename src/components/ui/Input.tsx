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
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-slate-600 ml-0.5"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none">
            <Icon size={16} strokeWidth={1.75} />
          </div>
        )}

        <InputPrimitive
          id={inputId}
          type={inputType}
          data-slot="input"
          className={cn(
            "w-full rounded-lg border bg-white py-2.5 text-sm text-slate-800 outline-none transition-all duration-150",
            "placeholder:text-slate-400",
            Icon ? "pl-10" : "pl-3.5",
            isPassword ? "pr-10" : "pr-3.5",
            error
              ? "border-rose-200 bg-rose-50/20 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 focus:bg-white",
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={15} strokeWidth={1.75} /> : <Eye size={15} strokeWidth={1.75} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-500 ml-0.5">{error}</p>
      )}
      {!error && hint && (
        <p className="text-xs text-slate-400 ml-0.5">{hint}</p>
      )}
    </div>
  )
}

export { Input }
