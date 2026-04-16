import React from "react"
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
  placeholder = "Search...", 
  className = "" 
}: SearchProps) {
  return (
    <div className={`relative group w-full sm:w-72 ${className}`}>
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
        <SearchIcon size={18} />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-10 py-2.5 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
