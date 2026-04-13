type Props = {
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
}

export default function Form({ onSubmit, children }: Props) {
  return <form onSubmit={onSubmit} className="flex flex-col gap-4">{children}</form>
}