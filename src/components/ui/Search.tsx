import { Search as SearchIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function Search({
  value,
  onChange,
  placeholder = "Cari data...",
  className = "",
}: SearchProps) {
  return (
    <div className={cn("relative group w-full", className)}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none z-10">
        <SearchIcon size={18} strokeWidth={2.5} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border bg-white pl-11 pr-11 py-2.5 text-sm font-bold text-slate-700 outline-none transition-all duration-200",
          "placeholder:text-slate-300 placeholder:font-medium",
          "border-slate-200 shadow-sm",
          "hover:border-slate-300",
          "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white"
        )}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all active:scale-90 z-10"
        >
          <X size={15} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
