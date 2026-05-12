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
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        <InputPrimitive
          id={inputId}
          type={inputType}
          data-slot="input"
          className={cn(
            "w-full rounded-2xl border bg-white py-3.5 text-sm font-bold text-slate-700 outline-none transition-all duration-200",
            "placeholder:text-slate-300 placeholder:font-medium",
            Icon ? "pl-11" : "pl-4",
            isPassword ? "pr-11" : "pr-4",
            error
              ? "border-rose-200 bg-rose-50/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              : "border-slate-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white",
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-orange-500 transition-colors"
          >
            {showPassword ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
          </button>
        )}
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

export { Input }
