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
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1"
        >
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        data-slot="textarea"
        className={cn(
          "w-full rounded-[1.5rem] border bg-white px-5 py-4 text-sm font-bold text-slate-700 outline-none transition-all duration-200 resize-y min-h-[120px]",
          "placeholder:text-slate-300 placeholder:font-medium",
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-50",
          error
            ? "border-rose-200 bg-rose-50/20 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
            : "border-slate-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white",
          className
        )}
        {...props}
      />

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

export { Textarea }
