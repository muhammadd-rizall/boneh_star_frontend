type Props = {
  children: React.ReactNode
  className?: string
}

function Card({ children, className }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow p-6 ${className}`}>
      {children}
    </div>
  )
}

export default Card;