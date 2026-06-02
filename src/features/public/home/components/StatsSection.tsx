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

function AnimatedStat({ value, label, sub, icon: Icon }: { value: number; label: string; sub: string; icon: React.ElementType }) {
  const { ref, inView } = useInView(0.3);
  const count = useCounter(value, 1400, inView);

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-4">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cloud-mist text-action-blue shadow-sm">
        <Icon size={20} strokeWidth={2} />
      </div>
      <p className="text-3xl font-bold tracking-tight text-midnight-indigo sm:text-4xl tabular-nums">
        {count}<span className="text-action-blue">+</span>
      </p>
      <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-blue">
        {label}
      </p>
      <p className="mt-1 text-xs font-medium text-platinum-tint">
        {sub}
      </p>
    </div>
  );
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - stats.founded;

  const cards = [
    { label: "Armada Bus", value: stats.buses, sub: "Unit terbaik", icon: Bus },
    { label: "Trip Selesai", value: stats.bookings, sub: "Perjalanan sukses", icon: CheckCircle2 },
    { label: "Rute Layanan", value: stats.routes, sub: "Destinasi tersedia", icon: MapPin },
    { label: "Tahun Beroperasi", value: experienceYears, sub: `Sejak ${stats.founded}`, icon: Calendar },
  ];

  return (
    <section className="relative py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4 md:divide-x md:divide-platinum-tint/50">
          {cards.map((card, i) => (
            <AnimatedStat key={i} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
