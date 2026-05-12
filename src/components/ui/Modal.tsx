import * as React from "react"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog"
import { cn } from "@/lib/utils"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
  className?: string
}

const sizeMap = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
  "2xl": "sm:max-w-5xl",
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  size = "md",
  className,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className={cn("rounded-[2.5rem] px-10 pb-10 pt-4 max-h-[92vh] overflow-y-auto", sizeMap[size], className)}>
        {(title || subtitle) && (
          <DialogHeader className="px-0 pt-6 pb-2 text-left">
            {title && (
              <DialogTitle className="text-2xl font-black tracking-tighter text-slate-950">
                {title}
              </DialogTitle>
            )}
            {subtitle && (
              <DialogDescription className="text-sm font-semibold text-slate-400">
                {subtitle}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}
