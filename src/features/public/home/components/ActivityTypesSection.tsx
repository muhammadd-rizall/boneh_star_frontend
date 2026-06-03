import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType";
import { MapPin, Star } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

interface ActivityTypesSectionProps {
  activityTypes: ActivityType[];
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522205408450-add114ad53fe?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop",
];

export default function ActivityTypesSection({ activityTypes }: ActivityTypesSectionProps) {
  const { ref: sectionRef, inView } = useInView(0.1);

  return (
    <section id="services" ref={sectionRef} className="bg-cloud-mist py-24 rounded-[48px] mx-4 lg:mx-8 mb-12 border border-platinum-tint/50 shadow-sm scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className={"mb-16 text-center flex flex-col items-center reveal " + (inView ? "in-view" : "")}>
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-6 shadow-sm">
          Layanan Kami
        </span>
        <h2 className="text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight">
          Layanan Unggulan{" "}
          <span className="text-action-blue">Untuk Setiap Perjalanan.</span>
        </h2>
        <p className="mt-4 text-lg font-medium text-slate-blue max-w-2xl mx-auto opacity-80">
          Solusi transportasi yang dipersonalisasi untuk setiap perjalanan Anda
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {activityTypes.slice(0, 4).map((item, i) => (
          <article
            key={item.id}
            className={"group relative flex flex-col rounded-[24px] border border-platinum-tint bg-white overflow-hidden transition-all hover:border-action-blue/30 hover:shadow-card hover:-translate-y-1.5 reveal " + (inView ? "in-view" : "")}
            style={{ "--delay": (i * 100) + "ms" } as React.CSSProperties}
          >
            {/* Image Container */}
            <div className="h-[200px] w-full overflow-hidden relative">
              <img 
                src={DEFAULT_IMAGES[i % DEFAULT_IMAGES.length]} 
                alt={item.name} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20">
                  <MapPin size={12} />
                  <span>Boneh Star</span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-action-blue px-3 py-1 text-xs font-bold text-white shadow-sm">
                  <Star size={12} fill="currentColor" />
                  <span>4.8</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold text-midnight-indigo group-hover:text-action-blue transition-colors line-clamp-1">
                {item.name}
              </h3>
              <p className="text-[14px] leading-relaxed text-slate-blue line-clamp-2">
                {item.description || "Layanan transportasi prima untuk kenyamanan perjalanan rombongan Anda."}
              </p>
            </div>
          </article>
        ))}
      </div>
      </div>
    </section>
  );
}
