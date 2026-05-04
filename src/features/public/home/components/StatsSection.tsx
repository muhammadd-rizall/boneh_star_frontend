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
    <section className="relative py-12 md:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px bg-slate-100 overflow-hidden rounded-3xl border border-slate-100 md:grid-cols-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group relative flex flex-col items-center bg-white p-8 text-center transition-all hover:bg-slate-50 md:p-12"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-transform group-hover:scale-110">
                <card.icon size={24} />
              </div>
              <p className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
                {card.value}+
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-4 text-[11px] font-medium text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                {card.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
