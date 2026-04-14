import React, { useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
       document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className={`
        relative w-full ${sizes[size]} overflow-hidden rounded-[32px] border border-white/60 bg-white/95 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)] 
        animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden
      `}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-8 py-6 backdrop-blur">
          <div>
            {title && <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>}
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal;
