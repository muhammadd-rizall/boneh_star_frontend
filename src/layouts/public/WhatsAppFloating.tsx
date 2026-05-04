import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";
import { buildWhatsAppHref } from "@/features/admin/company-profile/utils/companyProfileUtils";

interface WhatsAppFloatingProps {
  whatsapp: string[];
}

export default function WhatsAppFloating({ whatsapp }: WhatsAppFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!whatsapp || whatsapp.length === 0) return null;

  const numbers = whatsapp.slice(0, 2); // Ambil maksimal 2 nomor

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popover */}
      {isOpen && (
        <div className="mb-2 w-64 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Hubungi Admin Kami</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mb-4 text-xs text-slate-500">
            Punya pertanyaan? Chat admin kami sekarang untuk respon cepat.
          </p>
          <div className="flex flex-col gap-2">
            {numbers.map((num, i) => (
              <a
                key={i}
                href={buildWhatsAppHref(num)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 text-emerald-700 transition hover:bg-emerald-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Phone size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Admin {i + 1}</span>
                  <span className="text-xs font-bold">{num}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-110 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-25" />
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
