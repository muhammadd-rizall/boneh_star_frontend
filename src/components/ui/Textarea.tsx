import React from "react"

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  hint?: string
  /** icon is accepted for API compatibility but not rendered */
  icon?: React.ElementType
}

function Textarea({
  label,
  error,
  hint,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  icon: _icon,
  className = "",
  id,
  ...props
}: Props) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        className={[
          "w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-all duration-150 resize-y min-h-[100px]",
          "placeholder:text-slate-400",
          error
            ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
            : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100",
          className,
        ].join(" ")}
        {...props}
      />

      {error && (
        <p className="text-xs font-medium text-rose-600 flex items-center gap-1">
          <span className="inline-block h-1 w-1 rounded-full bg-rose-500" />
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="text-xs text-slate-400">{hint}</p>
      )}
    </div>
  )
}

export default Textarea