type Props = {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="text-center py-16 opacity-70">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p>{description}</p>}
    </div>
  )
}