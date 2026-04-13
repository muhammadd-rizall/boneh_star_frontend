type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string
  error?: string
}

function Textarea({ label, error, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}

      <textarea
        className={`border rounded-xl px-3 py-2 outline-none focus:ring w-full
        ${error ? "border-red-500" : "border-gray-300"}`}
        {...props}
      />

      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}

export default Textarea;