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
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-blue group-focus-within:text-action-blue transition-colors pointer-events-none z-10">
        <SearchIcon size={18} strokeWidth={2} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-lg border bg-white pl-11 pr-10 py-3 text-sm font-medium text-midnight-indigo outline-none transition-all duration-150",
          "placeholder:text-steel-gray placeholder:font-normal",
          "border-platinum-tint shadow-sm",
          "hover:border-slate-blue/30",
          "focus:border-action-blue focus:ring-4 focus:ring-action-blue/10 focus:bg-white"
        )}
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-blue hover:bg-cloud-mist hover:text-midnight-indigo transition-all z-10"
        >
          <X size={16} strokeWidth={2} />
        </button>
      )}
    </div>
  )
}
