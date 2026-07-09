import { useState } from "react";
import { 
  X, 
  Users, 
  Calendar, 
  Hash, 
  MessageCircle, 
  Wind, 
  Shield, 
  Armchair, 
  Briefcase, 
  Wifi, 
  Tv, 
  Usb, 
  Music, 
  Sparkles,
  Tag
} from "lucide-react";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import type { Bus } from "@/features/admin/buses/types/Bus";
import { getCapacityLabel } from "../utils/fleetCardUtils";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";

interface FleetDetailModalProps {
  bus: Bus;
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

  const whatsappUrl = profile.whatsapp?.[0]
    ? `https://wa.me/${profile.whatsapp[0].replace(/[^0-9]/g, "")}?text=Halo%20Admin%20Boneh%20Star,%20saya%20ingin%20sewa%20armada%20${encodeURIComponent(bus.name)}`
    : `https://wa.me/62821XXXXXXXX?text=Halo%20Admin%20Boneh%20Star,%20saya%20ingin%20sewa%20armada%20${encodeURIComponent(bus.name)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Modal Dialog container */}
      <div className="relative w-full max-w-4xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-in slide-in-from-bottom-8 duration-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-600 hover:text-action-blue border border-slate-100 hover:border-action-blue/20 transition-all shadow-md cursor-pointer backdrop-blur-sm"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Left Side: Image Gallery */}
        <div className="w-full md:w-1/2 bg-slate-50 flex flex-col p-6 border-r border-slate-100">
          <div className="flex-1 min-h-[260px] md:min-h-0 relative rounded-2xl overflow-hidden bg-cloud-mist border border-slate-150">
            {activeImageUrl ? (
              <img
                src={activeImageUrl}
                alt={`${bus.name} view`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-blue/30">
                <Users size={48} strokeWidth={1.2} />
              </div>
            )}
            {bus.category?.name && (
              <span className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-full bg-action-blue/15 text-action-blue text-[10px] font-extrabold uppercase tracking-wider border border-action-blue/10 backdrop-blur-md shadow-sm">
                {bus.category.name}
              </span>
            )}
          </div>

          {/* Thumbnail list */}
          {images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {images.map((img, idx) => {
                const thumbUrl = resolveMediaUrl(img.url);
                return (
                  <button
                    key={img.id || idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-16 w-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-action-blue scale-[0.98]"
                        : "border-slate-200 hover:border-slate-300"
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
        <div className="w-full md:w-1/2 flex flex-col p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-midnight-indigo pr-10 leading-tight">
              {bus.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-2 text-sm font-bold text-action-blue">
              <Users size={16} />
              <span>{capacityLabel.replace("kursi", "Seat")}</span>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 text-xs text-slate-blue font-bold">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-slate-blue/60" />
              <div>
                <p className="text-[10px] text-slate-blue/45 uppercase tracking-wider">Merek</p>
                <p className="text-midnight-indigo font-bold">{bus.brand || "Mercedes-Benz"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-slate-blue/60" />
              <div>
                <p className="text-[10px] text-slate-blue/45 uppercase tracking-wider">Tahun Produksi</p>
                <p className="text-midnight-indigo font-bold">{bus.production_year || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Hash size={15} className="text-slate-blue/60" />
              <div>
                <p className="text-[10px] text-slate-blue/45 uppercase tracking-wider">Nomor Polisi</p>
                <p className="text-midnight-indigo font-bold">{bus.plat_number || "-"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 text-left">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-blue/50 mb-2">Deskripsi</h3>
            <p className="text-xs leading-relaxed text-slate-blue/90 font-medium">
              {bus.notes || "Armada pariwisata eksekutif yang dirawat secara berkala untuk menjamin keselamatan dan kenyamanan perjalanan rombongan Anda dengan standar pelayanan prima."}
            </p>
          </div>

          {/* Full Facilities List */}
          <div className="mb-8 text-left">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-blue/50 mb-3">Fasilitas Armada</h3>
            
            {facilities.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {facilities.map((fac) => {
                  const Icon = getFacilityIcon(fac.name);
                  return (
                    <div 
                      key={fac.id} 
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-100 bg-white hover:border-action-blue/15 hover:bg-slate-50/30 transition-all text-xs font-bold text-slate-blue/80"
                    >
                      <Icon size={14} className="text-action-blue shrink-0" />
                      <span className="truncate">{fac.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Default Fallback Facilities
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Full AC", icon: Wind },
                  { name: "Toilet Bersih", icon: Shield },
                  { name: "Reclining Seat", icon: Armchair },
                  { name: "Bagasi Luas", icon: Briefcase }
                ].map((fac, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-100 bg-white text-xs font-bold text-slate-blue/80"
                  >
                    <fac.icon size={14} className="text-slate-blue/60 shrink-0" />
                    <span>{fac.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action CTA Button */}
          <div className="mt-auto border-t border-slate-100 pt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-action-blue hover:bg-action-blue-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md shadow-action-blue/15 hover:scale-[1.01] active:scale-[0.99]"
            >
              <MessageCircle size={15} />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
        
      </div>
    </div>
  );
}
