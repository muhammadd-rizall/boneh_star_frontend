import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ElementType
}

function Textarea({
  className,
  label,
  error,
  hint,
  icon: Icon,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-[13px] font-bold text-midnight-indigo ml-0.5 uppercase tracking-wider opacity-90"
        >
          {label}
        </label>
      )}

      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-5 text-slate-blue group-focus-within:text-action-blue transition-colors pointer-events-none">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}

        <textarea
          id={textareaId}
          data-slot="textarea"
          className={cn(
            "w-full rounded-xl border bg-white py-4 text-sm font-medium text-midnight-indigo outline-none transition-all duration-150 resize-y min-h-[140px] shadow-sm",
            "placeholder:text-steel-gray placeholder:font-normal",
            "disabled:cursor-not-allowed disabled:bg-cloud-mist disabled:opacity-50",
            Icon ? "pl-11 pr-5" : "pl-5 pr-5",
            error
              ? "border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              : "border-platinum-tint focus:border-action-blue focus:ring-4 focus:ring-action-blue/10 focus:bg-white hover:border-slate-blue/30",
            className
          )}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs font-bold text-red-500 ml-0.5">{error}</p>
      )}
      {!error && hint && (
        <p className="text-xs font-medium text-slate-blue ml-0.5 opacity-70">{hint}</p>
      )}
    </div>
  )
}

export { Textarea }
