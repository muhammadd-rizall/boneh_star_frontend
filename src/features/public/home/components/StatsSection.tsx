import { Bus, MapPin, Calendar, CheckCircle2 } from "lucide-react";

interface StatsSectionProps {
  stats: {
    buses: number;
    bookings: number;
    routes: number;
    founded: number;
  };
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const currentYear = new Date().getFullYear();
  const experienceYears = currentYear - stats.founded;

  const cards = [
    {
      label: "Armada Bus",
      value: stats.buses,
      sub: "Unit terbaik",
      icon: Bus,
    },
    {
      label: "Trip Selesai",
      value: stats.bookings,
      sub: "Perjalanan sukses",
      icon: CheckCircle2,
    },
    {
      label: "Rute Layanan",
      value: stats.routes,
      sub: "Destinasi tersedia",
      icon: MapPin,
    },
    {
      label: "Tahun Beroperasi",
      value: experienceYears,
      sub: `Sejak ${stats.founded}`,
      icon: Calendar,
    },
  ];

  return (
    <section className="relative py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center transition-all animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-500 shadow-sm shadow-slate-100">
                <card.icon size={24} strokeWidth={1.5} />
              </div>
              <p className="text-5xl font-black tracking-tighter text-slate-950 md:text-6xl">
                {card.value}<span className="text-orange-500">+</span>
              </p>
              <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <div className="mt-4 h-1 w-1 rounded-full bg-slate-100 group-hover:w-8 group-hover:bg-orange-200 transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
