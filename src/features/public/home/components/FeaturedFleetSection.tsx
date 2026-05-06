import type { Bus } from "@/features/admin/buses/types/Bus";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { Users, ArrowUpRight, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";

interface FeaturedFleetSectionProps {
  buses: Bus[];
}

export default function FeaturedFleetSection({ buses }: FeaturedFleetSectionProps) {
  if (buses.length === 0) return null;

  return (
    <section id="armada" className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 mb-6">
            <ShieldCheck size={14} />
            Armada Eksklusif
          </span>
          <h2 className="text-5xl font-black tracking-tighter text-slate-950 md:text-6xl leading-[1.1]">
            Kenyamanan Premium <br />
            <span className="text-orange-500">Di Setiap Unit Kami.</span>
          </h2>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {buses.map((bus, i) => {
            const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
            const imageUrl = resolveMediaUrl(primaryImage?.url);

            return (
              <div
                key={bus.id}
                className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Image Container */}
                <div className="relative aspect-[16/11] overflow-hidden rounded-[3rem] bg-white shadow-2xl shadow-slate-200/40 border-4 border-white transition-all duration-500 group-hover:shadow-orange-200/50 group-hover:-translate-y-2">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={bus.name}
                      className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-100 bg-slate-50">
                      <Users size={64} strokeWidth={1} />
                    </div>
                  )}
                  
                  {/* Floating Category Badge */}
                  <div className="absolute left-6 top-6 rounded-2xl bg-white/80 px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] text-slate-950 backdrop-blur-xl border border-white/50 shadow-xl shadow-black/5">
                    {bus.category?.name || "Premium Fleet"}
                  </div>

                  {/* Quick Detail Overlay */}
                  <div className="absolute bottom-6 left-6 right-6 translate-y-8 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="rounded-[1.5rem] bg-slate-950/90 p-4 backdrop-blur-xl flex items-center justify-between">
                      <div className="flex items-center gap-3 px-2">
                        <Users size={16} className="text-orange-500" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{bus.seat_count} Seats</span>
                      </div>
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-orange-600 text-white">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-8 px-4 text-center">
                  <h3 className="text-2xl font-black tracking-tight text-slate-950 mb-2 transition-colors group-hover:text-orange-600">
                    {bus.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Siap Jalan</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-20 flex justify-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-slate-200 font-black tracking-widest uppercase text-[10px] hover:bg-slate-950 hover:text-white transition-all duration-500 px-12"
          >
            Lihat Katalog Lengkap
          </Button>
        </div>
      </div>
    </section>
  );
}
