type Props = {
  message?: string
  onRetry?: () => void
}

export default function ErrorState({ message="Terjadi kesalahan", onRetry }: Props) {
  return (
    <div className="text-center py-10 space-y-3">
      <p className="text-red-500">{message}</p>
      {onRetry && <button onClick={onRetry}>Coba Lagi</button>}
    </div>
  )
}