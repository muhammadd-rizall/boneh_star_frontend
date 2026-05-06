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
  placeholder = "Cari data...",
  className = "",
}: SearchProps) {
  return (
    <div className={`relative group w-full ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
        <SearchIcon size={18} strokeWidth={2} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-11 pr-10 py-3.5 text-sm font-bold text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-300 placeholder:font-medium focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 focus:bg-white"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm hover:text-slate-900 transition-all active:scale-90"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      )}
    </div>
  )
}
