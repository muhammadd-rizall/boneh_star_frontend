type Variant = "success" | "error" | "info" | "warning"

type Props = {
  message: string
  variant?: Variant
}

export default function Alert({ message, variant="info" }: Props) {
  const styles = {
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    warning: "bg-yellow-100 text-yellow-700",
  }

  return <div className={`px-4 py-3 rounded-xl ${styles[variant]}`}>{message}</div>
}