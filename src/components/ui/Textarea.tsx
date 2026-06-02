import * as React from "react"
import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> {
  label?: string
  error?: string
  hint?: string
}

function Textarea({
  className,
  label,
  error,
  hint,
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

      <textarea
        id={textareaId}
        data-slot="textarea"
        className={cn(
          "w-full rounded-xl border bg-white px-5 py-4 text-sm font-medium text-midnight-indigo outline-none transition-all duration-150 resize-y min-h-[140px] shadow-sm",
          "placeholder:text-steel-gray placeholder:font-normal",
          "disabled:cursor-not-allowed disabled:bg-cloud-mist disabled:opacity-50",
          error
            ? "border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-platinum-tint focus:border-action-blue focus:ring-4 focus:ring-action-blue/10 focus:bg-white hover:border-slate-blue/30",
          className
        )}
        {...props}
      />

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
