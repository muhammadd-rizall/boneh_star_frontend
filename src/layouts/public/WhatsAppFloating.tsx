import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import { buildWhatsAppHref } from "@/features/admin/company-profile/utils/companyProfileUtils";

interface WhatsAppFloatingProps {
  whatsapp: string[];
}

export default function WhatsAppFloating({ whatsapp }: WhatsAppFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!whatsapp || whatsapp.length === 0) return null;

  const numbers = whatsapp.slice(0, 2);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popover */}
      {isOpen && (
        <div className="mb-1 w-72 rounded-2xl bg-white p-5 shadow-xl border border-slate-100">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Chat Admin</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          <p className="mb-5 text-xs text-slate-400 leading-relaxed">
            Tim support kami siap membantu Anda 24/7 untuk setiap kebutuhan perjalanan.
          </p>
          <div className="flex flex-col gap-2">
            {numbers.map((num, i) => (
              <a
                key={i}
                href={buildWhatsAppHref(num)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-emerald-50 p-3.5 text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white">
                  <Phone size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">Support 0{i + 1}</span>
                  <span className="text-sm font-semibold">{num}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X size={24} strokeWidth={2} /> : <MessageCircle size={26} strokeWidth={1.5} />}
      </button>
    </div>
  );
}
