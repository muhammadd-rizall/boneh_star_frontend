import type { Bus } from "@/features/admin/buses/types/Bus";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { ShieldCheck, Armchair, Calendar, Bus as BusIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface FeaturedFleetSectionProps {
  buses: Bus[];
}

const MAX_PREVIEW = 6;

export default function FeaturedFleetSection({ buses }: FeaturedFleetSectionProps) {
  if (buses.length === 0) return null;

  const preview = buses.slice(0, MAX_PREVIEW);
  const hasMore = buses.length > MAX_PREVIEW;

  return (
    <section id="armada" className="py-20 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-slate-500 text-[11px] font-semibold uppercase tracking-wider border border-slate-100 mb-5">
            <ShieldCheck size={13} />
            Armada Eksklusif
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
            Kenyamanan Premium{" "}
            <br className="hidden sm:block" />
            <span className="text-orange-500">Di Setiap Unit Kami.</span>
          </h2>
        </div>

        {/* Grid Cards — max 6 preview */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((bus, i) => (
            <FleetCard key={bus.id} bus={bus} index={i} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 flex justify-center">
          <Link
            to="/armada"
            className="group inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-8 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 hover:shadow-lg"
          >
            {hasMore
              ? `Lihat Semua Armada (${buses.length} Unit)`
              : "Lihat Katalog Lengkap"}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Fleet Card ─────────────────────────────────────────────── */
function FleetCard({ bus, index }: { bus: Bus; index: number }) {
  const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
  const imageUrl = resolveMediaUrl(primaryImage?.url);
  const facilities = bus.facilities?.slice(0, 3) || [];

  return (
    <div
      className="group flex flex-col rounded-2xl bg-white border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={bus.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-200">
            <BusIcon size={48} strokeWidth={1} />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-md shadow-sm">
          {bus.category?.name || "Premium"}
        </div>

        {/* Status Indicator */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-emerald-500/90 px-2.5 py-1 backdrop-blur-md">
          <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Tersedia</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
          {bus.name}
        </h3>
        {bus.brand && (
          <p className="mt-0.5 text-xs font-medium text-slate-400">{bus.brand}</p>
        )}

        {/* Quick Info */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Armchair size={14} className="text-slate-300" />
            <span className="text-xs font-semibold">{bus.seat_count} Kursi</span>
          </div>
          {bus.production_year && (
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar size={14} className="text-slate-300" />
              <span className="text-xs font-semibold">{bus.production_year}</span>
            </div>
          )}
        </div>

        {/* Facilities */}
        {facilities.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {facilities.map((f) => (
              <span
                key={f.id}
                className="inline-flex rounded-md bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500 border border-slate-100"
              >
                {f.name}
              </span>
            ))}
            {(bus.facilities?.length || 0) > 3 && (
              <span className="inline-flex rounded-md bg-orange-50 px-2 py-1 text-[10px] font-semibold text-orange-500 border border-orange-100">
                +{(bus.facilities?.length || 0) - 3} lagi
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
