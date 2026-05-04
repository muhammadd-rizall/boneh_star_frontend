import type { Bus } from "@/features/admin/buses/types/Bus";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { Users, Plus } from "lucide-react";

interface FeaturedFleetSectionProps {
  buses: Bus[];
}

export default function FeaturedFleetSection({ buses }: FeaturedFleetSectionProps) {
  if (buses.length === 0) return null;

  return (
    <section id="armada" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600 mb-4">Armada Unggulan</p>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Pilih Kendaraan Sesuai Kebutuhan.
          </h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {buses.map((bus) => {
            const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
            const imageUrl = resolveMediaUrl(primaryImage?.url);

            return (
              <div
                key={bus.id}
                className="group relative flex flex-col"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] bg-slate-100 shadow-2xl shadow-slate-200/50 transition-all group-hover:shadow-orange-500/10">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={bus.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <Users size={48} />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-orange-600/0 transition-colors group-hover:bg-orange-600/10" />
                  
                  {/* Category Badge */}
                  <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-900 backdrop-blur-md">
                    {bus.category?.name || "Premium Bus"}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-8 px-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                        {bus.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                          <Users size={12} className="text-orange-500" />
                          <span>{bus.seat_count} Kursi</span>
                        </div>
                        <div className="h-1 w-1 rounded-full bg-slate-200" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Available</span>
                      </div>
                    </div>
                    
                    <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-orange-600 active:scale-90">
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-20 flex justify-center">
          <button className="inline-flex h-14 items-center justify-center rounded-2xl border-2 border-slate-200 px-10 text-sm font-bold text-slate-900 transition-all hover:border-slate-900 active:scale-95">
            Lihat Semua Armada
          </button>
        </div>
      </div>
    </section>
  );
}
