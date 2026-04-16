import React from "react"

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
  icon?: React.ComponentType<{ size?: number | string; className?: string }>
}

function Textarea({ 
  label, 
  error, 
  icon: Icon,
  className = "",
  ...props 
}: Props) {
  return (
    <div className="flex flex-col gap-1.5 w-full text-left">
      {label && (
        <label className="ml-1 text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative group">
        {/* ICON KIRI */}
        {Icon && (
          <div className="absolute left-4 top-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
            <Icon size={18} />
          </div>
        )}

        <textarea
          className={`
            w-full rounded-2xl border bg-white px-4 py-3 outline-none transition-all duration-200
            ${Icon ? "pl-11" : "pl-4"}
            ${
              error
                ? "border-red-300 bg-red-50/40 text-red-900 placeholder:text-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            }
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="text-red-500 text-xs font-medium ml-1 font-medium">
          {error}
        </span>
      )}
    </div>
  )
}

export default Textarea;