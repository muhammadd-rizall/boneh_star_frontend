
import { Search as SearchIcon, X } from "lucide-react"

interface SearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function Search({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
}: SearchProps) {
  return (
    <div className={`relative group w-full sm:w-64 ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors pointer-events-none">
        <SearchIcon size={15} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 py-2.5 text-sm text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <X size={13} />
        </button>
      )}
    </div>
  )
}
