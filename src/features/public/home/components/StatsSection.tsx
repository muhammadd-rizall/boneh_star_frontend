import { Bus, MapPin, Calendar, CheckCircle2 } from "lucide-react";
import { useInView, useCounter } from "@/hooks/useAnimations";

interface StatsSectionProps {
  stats: {
    buses: number;
    bookings: number;
    routes: number;
    founded: number;
  };
}

function AnimatedStat({ value, label, icon: Icon, delay }: { value: number; label: string; icon: React.ElementType; delay: number }) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(value, 1400, inView);

  return (
    <div 
      ref={ref} 
      className={"flex flex-col items-center justify-center p-8 relative group reveal " + (inView ? "in-view" : "")}
      style={{ "--delay": delay + "ms" } as React.CSSProperties}
    >
      <div className="absolute inset-4 rounded-2xl bg-cloud-mist/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
      <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-action-blue/10 text-action-blue transition-transform duration-300 group-hover:scale-110 group-hover:bg-action-blue group-hover:text-white">
        <Icon size={24} strokeWidth={2} />
      </div>
      <p className="relative z-10 text-4xl font-black tracking-tight text-midnight-indigo tabular-nums mb-1">
        {count}<span className="text-action-blue">+</span>
      </p>
      <p className="relative z-10 text-xs font-bold uppercase tracking-wider text-slate-blue">
        {label}
      </p>
    </div>
  );
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - stats.founded;

  const cards = [
    { label: "Armada Bus", value: stats.buses, icon: Bus },
    { label: "Trip Selesai", value: stats.bookings, icon: CheckCircle2 },
    { label: "Rute Layanan", value: stats.routes, icon: MapPin },
    { label: "Tahun Beroperasi", value: experienceYears, icon: Calendar },
  ];

  return (
    <section className="relative z-20 -mt-16 sm:-mt-24 mb-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-platinum-tint overflow-hidden divide-x divide-y md:divide-y-0 divide-platinum-tint/50">
          {cards.map((card, i) => (
            <AnimatedStat key={i} {...card} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}
