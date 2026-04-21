export default function Loader({ text = "Memuat data..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-slate-600" />
      </div>
      {text && <p className="text-xs font-medium text-slate-400">{text}</p>}
    </div>
  )
}