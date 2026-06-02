import { Loader2 } from "lucide-react"

export default function Loader({ text = "Memuat data..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 animate-in fade-in duration-700">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-cloud-mist" />
        <Loader2 className="relative z-10 h-full w-full animate-spin text-action-blue" strokeWidth={2} />
      </div>
      {text && (
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-blue">
          {text}
        </p>
      )}
    </div>
  )
}