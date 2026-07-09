import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Whatsapp from "@thesvg/react/whatsapp";
import { buildWhatsAppHref } from "@/features/admin/company-profile/utils/companyProfileUtils";

interface WhatsAppFloatingProps {
  whatsapp: string[];
}

export default function WhatsAppFloating({ whatsapp }: WhatsAppFloatingProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!whatsapp || whatsapp.length === 0) return null;

  const numbers = whatsapp.filter(Boolean).slice(0, 2);

  if (numbers.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="w-[min(360px,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl border border-platinum-tint bg-white shadow-[0_24px_70px_-28px_rgba(11,53,88,0.45)] animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-4 border-b border-platinum-tint/70 bg-cloud-mist px-5 py-4">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                  <Whatsapp width={17} height={17} />
                </span>
                <h3 className="truncate text-base font-bold text-midnight-indigo">
                  Chat WhatsApp
                </h3>
              </div>
              <p className="text-sm leading-5 text-slate-blue">
                Pilih nomor admin untuk konsultasi pemesanan bus.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-blue transition-colors hover:bg-white hover:text-midnight-indigo focus:outline-none focus:ring-2 focus:ring-action-blue/30"
              aria-label="Tutup pilihan WhatsApp"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex flex-col gap-2 p-3">
            {numbers.map((num, i) => (
              <a
                key={i}
                href={buildWhatsAppHref(num)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-[#25D366]/30 hover:bg-[#25D366]/10 focus:outline-none focus:ring-2 focus:ring-[#25D366]/30"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15 text-[#128C7E] transition-colors group-hover:bg-[#25D366] group-hover:text-white">
                  <Whatsapp width={20} height={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-blue transition-colors group-hover:text-[#128C7E]">
                    Admin {i + 1}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-bold text-midnight-indigo">
                    {num}
                  </span>
                </div>
                <MessageCircle
                  size={18}
                  className="shrink-0 text-steel-gray transition-colors group-hover:text-[#128C7E]"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          backgroundColor: '#25D366',
          boxShadow: '0 12px 28px -6px rgba(37, 211, 102, 0.45), 0 8px 12px -8px rgba(37, 211, 102, 0.45)'
        }}
        className="group flex h-14 w-14 items-center justify-center rounded-full text-white border border-[#128C7E]/30 transition-all duration-200 hover:scale-105 active:scale-95 sm:h-15 sm:w-15"
        aria-label={isOpen ? "Tutup pilihan WhatsApp" : "Buka pilihan WhatsApp"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={26} strokeWidth={2.5} className="shrink-0 text-white" />
        ) : (
          <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" className="shrink-0 text-white">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.66.986 3.284 1.489 4.887 1.49 5.275 0 9.56-4.283 9.564-9.559.002-2.556-.994-4.959-2.805-6.771C16.425 2.503 14.032 1.5 11.478 1.5c-5.282 0-9.57 4.284-9.574 9.562a9.497 9.497 0 0 0 1.448 4.979l-.997 3.646 3.732-.977zm11.308-4.717c-.3-.15-1.771-.875-2.04-.972-.269-.098-.466-.147-.661.15-.196.296-.759.972-.931 1.168-.171.197-.344.22-.644.07-2.614-1.305-4.298-3.136-5.074-4.479-.204-.352-.029-.54.143-.711.154-.154.343-.4.515-.6.172-.2.23-.33.344-.55.115-.22.057-.41-.029-.56-.086-.15-.661-1.595-.906-2.18-.239-.57-.48-.493-.661-.502-.17-.008-.367-.01-.564-.01-.197 0-.517.073-.788.37-.27.296-1.03 1.007-1.03 2.457 0 1.45 1.055 2.85 1.202 3.05.148.197 2.077 3.17 5.034 4.447.703.304 1.252.486 1.68.622.707.225 1.35.193 1.86.117.567-.085 1.771-.724 2.02-1.424.25-.699.25-1.3.175-1.424-.075-.124-.27-.197-.57-.347z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
