import type { Bus } from "@/features/admin/buses/types/Bus";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { ShieldCheck, Armchair, Calendar, Bus as BusIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useAnimations";
import { Button } from "@/components/ui/Button";

interface FeaturedFleetSectionProps {
  buses: Bus[];
}

const MAX_PREVIEW = 6;

export default function FeaturedFleetSection({ buses }: FeaturedFleetSectionProps) {
  const { ref, inView } = useInView(0.05);

  if (buses.length === 0) return null;

  const preview = buses.slice(0, MAX_PREVIEW);
  const hasMore = buses.length > MAX_PREVIEW;

  return (
    <section id="armada" ref={ref} className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={"mb-16 text-center flex flex-col items-center reveal " + (inView ? "in-view" : "")}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-6 shadow-sm">
            <ShieldCheck size={14} />
            Armada Eksklusif
          </span>
          <h2 className="text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight">
            Kenyamanan Premium{" "}
            <br className="hidden sm:block" />
            <span className="text-action-blue">Di Setiap Unit Kami.</span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((bus, i) => (
            <FleetCard key={bus.id} bus={bus} index={i} inView={inView} />
          ))}
        </div>

        <div className={"mt-16 flex justify-center reveal " + (inView ? "in-view" : "")} style={{ "--delay": "400ms" } as React.CSSProperties}>
          <Link to="/armada">
            <Button 
              variant="outline" 
              className="rounded-full px-10 h-14 font-bold border-platinum-tint shadow-sm hover:border-action-blue hover:text-action-blue transition-all"
            >
              {hasMore ? `Lihat Semua Armada (${buses.length} Unit)` : "Lihat Katalog Lengkap"}
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FleetCard({ bus, index, inView }: { bus: Bus; index: number; inView: boolean }) {
  const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
  const imageUrl = resolveMediaUrl(primaryImage?.url);
  const facilities = bus.facilities?.slice(0, 3) || [];

  return (
    <div
      className={"group flex flex-col rounded-xl bg-white border border-platinum-tint overflow-hidden hover:shadow-card hover:border-action-blue/30 transition-all duration-500 hover:-translate-y-2 reveal " + (inView ? "in-view" : "")}
      style={{ "--delay": (index * 100) + "ms" } as React.CSSProperties}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-cloud-mist">
        {imageUrl ? (
          <img src={imageUrl} alt={bus.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-platinum-tint"><BusIcon size={56} strokeWidth={1} /></div>
        )}
        <div className="absolute left-4 top-4 rounded-lg bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-midnight-indigo shadow-sm backdrop-blur-md">{bus.category?.name || "Premium"}</div>
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-lg bg-emerald-500/90 px-3 py-1.5 backdrop-blur-md shadow-sm border border-white/20">
          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Tersedia</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-xl font-bold tracking-tight text-midnight-indigo group-hover:text-action-blue transition-colors">{bus.name}</h3>
        {bus.brand && <p className="mt-1 text-sm font-medium text-slate-blue opacity-70">{bus.brand}</p>}
        
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-slate-blue bg-cloud-mist/50 px-3 py-1.5 rounded-lg border border-platinum-tint/30">
            <Armchair size={16} className="text-action-blue" />
            <span className="text-xs font-bold">{bus.seat_count} Kursi</span>
          </div>
          {bus.production_year && (
            <div className="flex items-center gap-2 text-slate-blue bg-cloud-mist/50 px-3 py-1.5 rounded-lg border border-platinum-tint/30">
              <Calendar size={16} className="text-action-blue" />
              <span className="text-xs font-bold">{bus.production_year}</span>
            </div>
          )}
        </div>
        
        {facilities.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {facilities.map((f) => (
              <span key={f.id} className="inline-flex rounded-md bg-cloud-mist border border-platinum-tint/50 px-2.5 py-1 text-[10px] font-bold text-slate-blue">{f.name}</span>
            ))}
            {(bus.facilities?.length || 0) > 3 && (
              <span className="inline-flex rounded-md bg-platinum-tint/20 px-2.5 py-1 text-[10px] font-bold text-slate-blue">+{(bus.facilities?.length || 0) - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
