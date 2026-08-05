import { 
  Wind, 
  Armchair, 
  Briefcase, 
  ArrowRight, 
  Users, 
  Shield, 
  Wifi, 
  Tv, 
  Usb, 
  Music, 
  Sparkles 
} from "lucide-react";
import { resolveMediaUrl, buildWhatsAppHref, normalizeWhatsApp } from "@/features/admin/company-profile/utils/companyProfileUtils";
import type { Bus } from "@/features/admin/buses/types/Bus";
import { cn } from "@/lib/utils";
import { getCapacityLabel } from "../utils/fleetCardUtils";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { formatCurrency } from "@/utils/formatter";
import { motion } from "motion/react";

export interface FleetCardProps {
  bus: Bus;
  index?: number;
  inView?: boolean;
  className?: string;
  onViewDetail?: (bus: Bus) => void;
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

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

export default function FleetCard({
  bus,
  index: _index = 0,
  inView: _inView = true,
  className,
  onViewDetail,
}: FleetCardProps) {
  const { profile } = usePublicCompanyProfile();
  
  const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
  const imageUrl = resolveMediaUrl(primaryImage?.url);
  const facilities = bus.facilities ?? [];
  const capacityLabel = getCapacityLabel(bus);

  const defaultDesc = (bus as any).description || bus.notes || (
    bus.category?.name.toLowerCase().includes("big")
      ? "Cocok untuk perjalanan jarak jauh dengan kenyamanan ekstra."
      : bus.category?.name.toLowerCase().includes("medium")
      ? "Ukuran ideal untuk rombongan sedang dengan fasilitas lengkap."
      : "Cocok untuk rombongan kecil dan perjalanan dalam kota."
  );

  const whatsappNumbers = normalizeWhatsApp(profile?.whatsapp);
  const primaryWhatsApp = whatsappNumbers[0] || "62821XXXXXXXX";
  const whatsappUrl = buildWhatsAppHref(
    primaryWhatsApp,
    `Halo Admin Boneh Star, saya tertarik ingin tanya detail menyewa armada ${bus.name}`
  );

  const handleDetailClick = (e: React.MouseEvent) => {
    if (onViewDetail) {
      e.preventDefault();
      onViewDetail(bus);
    }
  };

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[24px] border border-platinum-tint bg-white",
        "transition-all duration-300 hover:border-action-blue/25 hover:shadow-card hover:-translate-y-1.5",
        className
      )}
    >
      {/* Image Area with Badge */}
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden bg-cloud-mist">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={bus.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-blue/30">
            <Users size={40} strokeWidth={1.5} />
          </div>
        )}
        
        {/* Category Badge */}
        {bus.category?.name && (
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-action-blue/15 text-action-blue text-[10px] font-extrabold uppercase tracking-wider border border-action-blue/10 backdrop-blur-md shadow-sm">
              {bus.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-bold text-midnight-indigo transition-colors group-hover:text-action-blue leading-snug">
          {bus.name}
        </h3>
        
        {/* Seat Capacity */}
        <div className="flex items-center gap-1.5 mt-1.5 text-xs font-bold text-slate-blue/80">
          <Users size={14} className="text-action-blue shrink-0" />
          <span>{capacityLabel.replace("kursi", "Seat")}</span>
        </div>

        {/* Description */}
        <p className="mt-3.5 text-sm font-medium text-slate-blue leading-relaxed opacity-85 line-clamp-2">
          {defaultDesc}
        </p>

        {/* Dynamic Facilities Grid */}
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-slate-100 pt-4 text-[11px] font-bold text-slate-blue/70">
          {facilities.length > 0 ? (
            <>
              {facilities.slice(0, 3).map((f) => {
                const Icon = getFacilityIcon(f.name);
                return (
                  <span key={f.id} className="flex items-center gap-1.5 truncate" title={f.name}>
                    <Icon size={13} className="text-action-blue shrink-0" />
                    <span className="truncate">{f.name}</span>
                  </span>
                );
              })}
              {facilities.length > 3 && (
                <span className="flex items-center gap-1.5 text-action-blue font-extrabold">
                  <Sparkles size={13} className="shrink-0" />
                  <span>+{facilities.length - 3} Lainnya</span>
                </span>
              )}
            </>
          ) : (
            // Fallback default facilities
            <>
              <span className="flex items-center gap-1.5">
                <Wind size={13} className="text-slate-blue/60 shrink-0" /> AC
              </span>
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-slate-blue/60 shrink-0" /> Toilet
              </span>
              <span className="flex items-center gap-1.5">
                <Armchair size={13} className="text-slate-blue/60 shrink-0" /> Reclining Seat
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase size={13} className="text-slate-blue/60 shrink-0" /> Bagasi Luas
              </span>
            </>
          )}
        </div>

        {/* Dynamic Pricing Estimate (If available) */}
        {bus.category?.price_inside_min && bus.category?.price_outside && (
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs font-bold text-slate-blue">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-blue/60 uppercase tracking-wide">Dalam Kota:</span>
              <span className="text-midnight-indigo font-black text-sm">{formatCurrency(bus.category.price_inside_min)}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex flex-col text-right">
              <span className="text-[9px] text-slate-blue/60 uppercase tracking-wide">Luar Kota / Hari:</span>
              <span className="text-midnight-indigo font-black text-sm">
                {formatCurrency(bus.category.price_outside)}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto pt-5">
          <a
            href={whatsappUrl}
            onClick={handleDetailClick}
            className="flex items-center justify-center gap-2 w-full py-3.5 border border-action-blue/20 hover:border-action-blue text-action-blue hover:bg-action-blue hover:text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm cursor-pointer"
          >
            Lihat Detail 
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
