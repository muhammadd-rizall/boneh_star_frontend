import React from "react"

type Props = {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
}

function Card({ children, className = "", padding = "md" }: Props) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
