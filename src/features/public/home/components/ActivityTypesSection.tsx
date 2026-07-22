import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType";
import {
  GraduationCap,
  Car,
  Trees,
  Landmark,
  Calendar,
  Compass,
  ShieldCheck,
  Clock3,
  UsersRound,
  ClipboardCheck,
} from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

interface ActivityTypesSectionProps {
  activityTypes: ActivityType[];
}

const getServiceIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("studi") || lowerName.includes("tour")) return GraduationCap;
  if (lowerName.includes("jemput") || lowerName.includes("antar") || lowerName.includes("shuttle")) return Car;
  if (lowerName.includes("wisata") || lowerName.includes("liburan")) return Trees;
  if (lowerName.includes("ziarah") || lowerName.includes("religi") || lowerName.includes("ibadah")) return Landmark;
  if (lowerName.includes("event") || lowerName.includes("acara") || lowerName.includes("nikah") || lowerName.includes("wedding")) return Calendar;
  return Compass;
};

const highlights = [
  {
    icon: ShieldCheck,
    title: "Aman & Nyaman",
    description: "Armada terawat dengan fasilitas lengkap untuk perjalanan Anda.",
  },
  {
    icon: Clock3,
    title: "Tepat Waktu",
    description: "Kami selalu mengutamakan ketepatan waktu perjalanan.",
  },
  {
    icon: UsersRound,
    title: "Pelayanan Profesional",
    description: "Didukung oleh tim berpengalaman siap melayani Anda.",
  },
  {
    icon: ClipboardCheck,
    title: "Harga Kompetitif",
    description: "Harga bersaing dengan pelayanan terbaik untuk Anda.",
  },
];

export default function ActivityTypesSection({ activityTypes }: ActivityTypesSectionProps) {
  const { ref: sectionRef, inView } = useInView(0.1);

  // Filter out soft-deleted items and only take the first 5 items
  const displayActivities = activityTypes
    .filter((item) => !item.deleted_at)
    .slice(0, 5);

  return (
    <section 
      id="services" 
      ref={sectionRef} 
      className="bg-white py-24 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Highlights Row */}
        <div className={"mb-24 rounded-3xl bg-cloud-mist border border-slate-100 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-slate-200/60 reveal " + (inView ? "in-view" : "")}>
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <div 
                key={i} 
                className="flex items-center gap-4 lg:px-6 first:pl-0 last:pr-0"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-action-blue/10 text-action-blue shadow-sm">
                  <Icon size={24} className="stroke-[1.8]" />
                </div>
                <div className="text-left">
                  <h4 className="text-[15px] font-bold text-midnight-indigo">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-blue/80">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Header */}
        <div className={"mb-16 text-center flex flex-col items-center reveal " + (inView ? "in-view" : "")}>
          <span className="text-action-blue text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
            LAYANAN KAMI
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-midnight-indigo leading-tight">
            Melayani Berbagai Kebutuhan Perjalanan Anda
          </h2>
          <div className="mt-4 h-[3px] w-12 rounded-full bg-action-blue" />
        </div>

        {/* Services Grid (Horizontal on Desktop, wraps responsively) */}
        <div className="flex flex-wrap gap-6 justify-center">
          {displayActivities.map((item, i) => {
            const Icon = getServiceIcon(item.name);

            return (
              <article
                key={item.id}
                className={`group relative flex w-[220px] flex-col rounded-[24px] border border-slate-100 bg-white p-8 text-center transition-all duration-300 hover:border-action-blue/30 hover:shadow-card hover:-translate-y-1.5 reveal ${
                  inView ? "in-view" : ""
                }`}
                style={{ "--delay": (i * 80) + "ms" } as React.CSSProperties}
              >
                {/* Icon / Image Container */}
                <div className="mb-6 flex justify-center transition-transform duration-300 group-hover:scale-110">
                  {item.image_url ? (
                    <div className="h-[72px] w-[72px] overflow-hidden rounded-[20px] border border-slate-100 bg-slate-50 shadow-sm flex items-center justify-center">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ) : (
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-action-blue/10 text-action-blue shadow-sm">
                      <Icon size={32} className="stroke-[1.5]" />
                    </div>
                  )}
                </div>
                
                {/* Card Title */}
                <h3 className="mb-3 text-lg font-bold text-midnight-indigo group-hover:text-action-blue transition-colors">
                  {item.name}
                </h3>
                
                {/* Card Description */}
                <p className="text-[13px] leading-relaxed text-slate-blue/80 line-clamp-3">
                  {item.description || "Layanan transportasi prima untuk kenyamanan perjalanan Anda."}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
