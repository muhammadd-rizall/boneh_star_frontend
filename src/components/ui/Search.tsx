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
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none z-10">
        <SearchIcon size={15} strokeWidth={2} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border bg-white pl-10 pr-9 py-2 text-sm text-slate-700 outline-none transition-all duration-150",
          "placeholder:text-slate-400",
          "border-slate-200 shadow-sm",
          "hover:border-slate-300",
          "focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:bg-white"
        )}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all z-10"
        >
          <X size={13} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
