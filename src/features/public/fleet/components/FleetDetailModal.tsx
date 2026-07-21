import { useState } from "react";
import { 
  X, 
  Users, 
  Hash, 
  Wind, 
  Shield, 
  Armchair, 
  Briefcase, 
  Wifi, 
  Tv, 
  Usb, 
  Music, 
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Bus,
  Lightbulb
} from "lucide-react";
import { Whatsapp } from "@thesvg/react";
import { 
  resolveMediaUrl, 
  buildWhatsAppHref, 
  normalizeWhatsApp 
} from "@/features/admin/company-profile/utils/companyProfileUtils";
import type { Bus as BusType } from "@/features/admin/buses/types/Bus";
import { getCapacityLabel } from "../utils/fleetCardUtils";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";

interface FleetDetailModalProps {
  bus: BusType;
  onClose: () => void;
}

const getFacilityIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("ac")) return Wind;
  if (lower.includes("toilet")) return Shield;
  if (lower.includes("seat") || lower.includes("kursi") || lower.includes("reclining")) return Armchair;
  if (lower.includes("bagasi") || lower.includes("baggage") || lower.includes("koper")) return Briefcase;
  if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
  if (lower.includes("tv") || lower.includes("lcd") || lower.includes("monitor")) return Tv;
  if (lower.includes("usb") || lower.includes("charger") || lower.includes("cas")) return Usb;
  if (lower.includes("karaoke") || lower.includes("musik") || lower.includes("audio")) return Music;
  if (lower.includes("lampu") || lower.includes("led") || lower.includes("lighting")) return Lightbulb;
  return Sparkles;
};

export default function FleetDetailModal({ bus, onClose }: FleetDetailModalProps) {
  const { profile } = usePublicCompanyProfile();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = bus.images ?? [];
  const activeImage = images[activeImageIndex] || images[0];
  const activeImageUrl = resolveMediaUrl(activeImage?.url);
  const facilities = bus.facilities ?? [];
  const capacityLabel = getCapacityLabel(bus);

  const whatsappNumbers = normalizeWhatsApp(profile?.whatsapp);
  const primaryWhatsApp = whatsappNumbers[0];
  const whatsappHref = primaryWhatsApp
    ? `${buildWhatsAppHref(primaryWhatsApp)}?text=Halo%20Admin%20Boneh%20Star,%20saya%20ingin%20tanya%20sewa%20armada%20${encodeURIComponent(bus.name)}`
    : `https://wa.me/6281234567890?text=Halo%20Admin%20Boneh%20Star,%20saya%20ingin%20tanya%20sewa%20armada%20${encodeURIComponent(bus.name)}`;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 0) {
      setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 0) {
      setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
      onClick={onClose}
    >
      {/* Modal Dialog container with general padding */}
      <div 
        className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 max-h-[90vh] md:max-h-[85vh] overflow-y-auto md:overflow-hidden animate-in slide-in-from-bottom-8 duration-300 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button floating in padding */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-100 transition-all shadow-sm cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Left Side: Image Gallery Card */}
        <div className="w-full md:w-[52%] relative min-h-[320px] md:min-h-0 bg-slate-950 rounded-[24px] overflow-hidden flex items-center justify-center shrink-0">
          {activeImageUrl ? (
            <img
              src={activeImageUrl}
              alt={`${bus.name} view`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              <Bus size={48} strokeWidth={1.2} />
            </div>
          )}

          {/* Category Badge overlay */}
          {bus.category?.name && (
            <div className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#006bff] text-xs font-bold shadow-md border border-slate-100/50">
              <Bus size={14} className="stroke-[2.5]" />
              <span className="uppercase tracking-wider text-[10px]">
                {bus.category.name}
              </span>
            </div>
          )}

          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#006bff] border border-slate-100 transition-all shadow shadow-slate-900/5 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} strokeWidth={2.2} />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#006bff] border border-slate-100 transition-all shadow shadow-slate-900/5 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={20} strokeWidth={2.2} />
              </button>
            </>
          )}

          {/* Floating Thumbnail list */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2.5 max-w-[90%] overflow-x-auto no-scrollbar py-1">
              {images.map((img, idx) => {
                const thumbUrl = resolveMediaUrl(img.url);
                return (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-14 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shadow-md bg-white ${
                      activeImageIndex === idx
                        ? "border-[#006bff] scale-102"
                        : "border-white/50 hover:border-white"
                    }`}
                  >
                    <img
                      src={thumbUrl}
                      alt="thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Specifications & Details */}
        <div className="w-full md:w-[48%] flex flex-col justify-between overflow-y-auto pr-1">
          <div>
            {/* Header */}
            <div className="mb-6 pr-10">
              <h2 className="text-3xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
                {bus.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-2 text-sm font-semibold text-[#006bff]">
                <Users size={16} />
                <span>{capacityLabel.replace("kursi", "Seat")}</span>
              </div>
            </div>

            {/* Key Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50/50 text-[#006bff] border border-blue-100/50">
                  <ShieldCheck size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Merek</p>
                  <p className="text-sm text-slate-800 font-extrabold">{bus.brand || "Mercedes-Benz"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50/50 text-[#006bff] border border-blue-100/50">
                  <Hash size={20} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Nomor Polisi</p>
                  <p className="text-sm text-slate-800 font-extrabold">{bus.plat_number || "-"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6 text-left">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-2">Deskripsi</h3>
              <p className="text-sm leading-relaxed text-slate-500 font-medium">
                {bus.notes || "Armada pariwisata eksekutif yang dirawat secara berkala untuk menjamin keselamatan dan kenyamanan perjalanan rombongan Anda dengan standar pelayanan prima."}
              </p>
            </div>

            {/* Full Facilities List */}
            <div className="mb-6 text-left">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-3">Fasilitas Armada</h3>
              
              {facilities.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {facilities.map((fac) => {
                    const Icon = getFacilityIcon(fac.name);
                    return (
                      <div 
                        key={fac.id} 
                        className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl border border-slate-100 bg-[#f8fafc]/50 text-xs font-bold text-slate-700 shadow-sm hover:border-[#006bff]/20 hover:bg-slate-50/20 transition-all"
                      >
                        <Icon size={16} className="text-[#006bff] shrink-0" strokeWidth={1.8} />
                        <span className="truncate">{fac.name}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Default Fallback Facilities
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Karaoke", icon: Music },
                    { name: "Reclining Seat", icon: Armchair },
                    { name: "USB Charger", icon: Usb },
                    { name: "AC", icon: Wind },
                    { name: "Bagasi Luas", icon: Briefcase },
                    { name: "Lampu LED", icon: Lightbulb }
                  ].map((fac, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2.5 px-4 py-3.5 rounded-xl border border-slate-100 bg-[#f8fafc]/50 text-xs font-bold text-slate-700 shadow-sm hover:border-[#006bff]/20 hover:bg-slate-50/20 transition-all"
                    >
                      <fac.icon size={16} className="text-[#006bff] shrink-0" strokeWidth={1.8} />
                      <span>{fac.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action CTA Button */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full py-4 bg-[#006bff] hover:bg-[#005ad4] text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 shadow-md shadow-[#006bff]/15 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Whatsapp className="size-5 fill-white" />
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
