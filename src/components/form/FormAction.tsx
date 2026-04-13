type Props = {
  children: React.ReactNode
}

export default function FormActions({ children }: Props) {
  return <div className="flex gap-2 justify-end pt-4">{children}</div>
}