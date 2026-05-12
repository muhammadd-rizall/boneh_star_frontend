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
    <section className="relative py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:divide-x md:divide-slate-100">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group flex flex-col items-center text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500 transition-colors duration-300">
                <card.icon size={20} strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {card.value}<span className="text-orange-500">+</span>
              </p>
              <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {card.label}
              </p>
              <p className="mt-1 text-xs text-slate-300">
                {card.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
