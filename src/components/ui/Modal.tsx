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
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`relative w-full ${sizes[size]} flex flex-col max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl`}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex flex-shrink-0 items-start justify-between border-b border-slate-100 px-6 py-4">
            <div>
              {title && (
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
