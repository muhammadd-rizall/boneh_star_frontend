import * as React from "react"
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
  xl: "sm:max-w-4xl",
  "2xl": "sm:max-w-6xl",
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
      <DialogContent className={cn("rounded-[24px] p-0 max-h-[90vh] overflow-hidden flex flex-col border-none shadow-2xl", sizeMap[size], className)}>
        {(title || subtitle) && (
          <DialogHeader className="px-6 pt-6 pb-4 sm:px-10 sm:pt-10 sm:pb-6 text-left border-b border-platinum-tint/40 bg-white sticky top-0 z-10">
            {title && (
              <DialogTitle className="text-xl sm:text-3xl font-semibold tracking-tight text-midnight-indigo leading-tight">
                {title}
              </DialogTitle>
            )}
            {subtitle && (
              <DialogDescription className="text-xs sm:text-sm md:text-lg font-medium mt-1 sm:mt-2 leading-relaxed opacity-80">
                {subtitle}
              </DialogDescription>
            )}
          </DialogHeader>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-10 sm:py-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
