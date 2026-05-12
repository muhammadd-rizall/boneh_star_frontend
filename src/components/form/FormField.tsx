import { Input } from "../ui/Input"

type Props = {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
}

export default function FormField({ label, value, onChange, error, type="text" }: Props) {
  return <Input label={label} value={value} onChange={onChange} error={error} type={type} />
}