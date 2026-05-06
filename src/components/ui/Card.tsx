import React from "react"

type Props = {
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
} & React.HTMLAttributes<HTMLDivElement>

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
}

function Card({ children, className = "", padding = "md", ...props }: Props) {
  return (
    <div
      {...props}
      className={`rounded-[2rem] border border-slate-100 bg-white shadow-sm shadow-slate-200/50 ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
