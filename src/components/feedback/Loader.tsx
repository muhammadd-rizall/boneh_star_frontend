export default function Loader({ text = "Memuat data..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20 animate-in fade-in duration-700">
      <div className="flex items-center gap-2.5 h-6">
        <div className="h-3.5 w-3.5 rounded-full bg-action-blue animate-bounce [animation-delay:-0.3s]" />
        <div className="h-3.5 w-3.5 rounded-full bg-action-blue animate-bounce [animation-delay:-0.15s]" />
        <div className="h-3.5 w-3.5 rounded-full bg-action-blue animate-bounce" />
      </div>
      {text && (
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-blue">
          {text}
        </p>
      )}
    </div>
  )
}