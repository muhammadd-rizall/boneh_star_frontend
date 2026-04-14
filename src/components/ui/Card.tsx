type Props = {
  children: React.ReactNode
  className?: string
}

function Card({ children, className }: Props) {
  return (
    <div className={`rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_18px_45px_-30px_rgba(15,23,42,0.35)] backdrop-blur ${className}`}>
      {children}
    </div>
  )
}

export default Card;
