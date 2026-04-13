type Props = {
  title: string
  children: React.ReactNode
}

export default function FormSection({ title, children }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">{title}</h3>
      {children}
    </div>
  )
}