import { Loader2 } from "lucide-react"

export default function Loader({ text = "Memuat data..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 animate-in fade-in duration-700">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
        <Loader2 className="relative z-10 h-full w-full animate-spin text-orange-500" strokeWidth={1.5} />
      </div>
      {text && (
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          {text}
        </p>
      )}
    </div>
  )
}