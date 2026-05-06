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
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
      {/* Popover */}
      {isOpen && (
        <div className="mb-2 w-72 rounded-[2rem] border-none bg-white p-6 shadow-2xl shadow-emerald-900/10 animate-in fade-in slide-in-from-bottom-6 duration-500">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-950">Chat Admin</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mb-6 text-xs font-semibold text-slate-400 leading-relaxed">
            Tim support kami siap membantu Anda 24/7 untuk setiap kebutuhan perjalanan.
          </p>
          <div className="flex flex-col gap-3">
            {numbers.map((num, i) => (
              <a
                key={i}
                href={buildWhatsAppHref(num)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-4 text-emerald-700 transition-all hover:bg-emerald-100 hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <Phone size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Support 0{i + 1}</span>
                  <span className="text-sm font-black">{num}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 transition-all hover:scale-110 active:scale-90"
      >
        <span className="absolute inset-0 rounded-[1.75rem] bg-emerald-500 animate-ping opacity-20" />
        {isOpen ? <X size={28} strokeWidth={2.5} /> : <MessageCircle size={32} strokeWidth={2} />}
      </button>
    </div>
  );
}
