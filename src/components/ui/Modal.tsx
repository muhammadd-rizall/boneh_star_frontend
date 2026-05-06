import React, { useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "2xl"
}

function Modal({ open, onClose, title, subtitle, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  if (!open) return null

  const sizes: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-3xl",
    "2xl": "max-w-5xl",
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative w-full ${sizes[size]} flex flex-col max-h-[92vh] overflow-hidden rounded-[2.5rem] border-none bg-white shadow-2xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-500`}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex flex-shrink-0 items-start justify-between px-10 pt-10 pb-6">
            <div className="flex flex-col gap-1">
              {title && (
                <h3 className="text-2xl font-black tracking-tighter text-slate-950">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm font-semibold text-slate-400">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all hover:text-slate-950 active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {!title && !subtitle && (
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all hover:text-slate-950 active:scale-90"
          >
            <X size={20} />
          </button>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-10 pb-10 pt-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
