import React from "react"

type Props = {
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
} & React.HTMLAttributes<HTMLDivElement>

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
}

function Card({ children, className = "", padding = "md", ...props }: Props) {
  return (
    <div
      {...props}
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
