import type { BusAvailability } from "../types/BusAvailabilityReport";
import { Bus, CheckCircle2, Calendar, Wrench, XCircle } from "lucide-react";

interface BusAvailabilityMetricsProps {
  data: BusAvailability[];
  period: {
    start_date: string;
    end_date: string;
  };
}

export default function BusAvailabilityMetrics({ data, period }: BusAvailabilityMetricsProps) {
  const start = new Date(period.start_date);
  const end = new Date(period.end_date);
  
  // Generate dates array
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  const totalDays = dates.length || 1;

  // Calculate metrics
  const totalBuses = data.length;
  
  let bookedDays = 0;
  let maintenanceDays = 0;
  let unavailableDays = 0;
  let availableDays = 0;

  data.forEach(bus => {
    // 1. Maintenance days (calculated if bus status is maintenance)
    if (bus.status === 'maintenance') {
      maintenanceDays += totalDays;
    }

    dates.forEach(date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      
      const schedule = bus.schedules.find(s => {
        const sStart = new Date(s.departure_date);
        sStart.setHours(0, 0, 0, 0);
        const sEnd = s.return_date ? new Date(s.return_date) : sStart;
        sEnd.setHours(0, 0, 0, 0);
        return d >= sStart && d <= sEnd;
      });

      if (bus.status === 'maintenance') {
        // Already added to maintenanceDays, not available
        return;
      }

      if (schedule) {
        if (schedule.status === 'confirmed' || schedule.status === 'completed') {
          bookedDays++;
        } else {
          unavailableDays++;
        }
      } else {
        availableDays++;
      }
    });
  });

  const totalPossibleBusDays = totalBuses * totalDays;
  const availabilityPercentage = totalPossibleBusDays > 0 
    ? Math.round((availableDays / totalPossibleBusDays) * 100)
    : 0;

  const cards = [
    {
      title: "Total Armada",
      value: `${totalBuses}`,
      subtitle: "Unit bus aktif",
      icon: Bus,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50/70 border border-blue-100/50",
      iconBg: "bg-blue-50 border border-blue-100",
    },
    {
      title: "Tersedia",
      value: `${availabilityPercentage}%`,
      subtitle: "Rata-rata ketersediaan",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50/70 border border-emerald-100/50",
      iconBg: "bg-emerald-50 border border-emerald-100",
    },
    {
      title: "Dipesan",
      value: `${bookedDays} Hari`,
      subtitle: "Total hari dipesan",
      icon: Calendar,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50/50 border border-purple-100/50",
      iconBg: "bg-purple-50 border border-purple-100",
    },
    {
      title: "Maintenance",
      value: `${maintenanceDays} Hari`,
      subtitle: "Dalam perawatan",
      icon: Wrench,
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50/50 border border-amber-100/50",
      iconBg: "bg-amber-50 border border-amber-100",
    },
    {
      title: "Tidak Tersedia",
      value: `${unavailableDays} Hari`,
      subtitle: "Tidak dapat digunakan",
      icon: XCircle,
      iconColor: "text-slate-500",
      bgColor: "bg-slate-50 border border-slate-100/50",
      iconBg: "bg-slate-100 border border-slate-200/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={idx} 
            className="flex items-center gap-4 rounded-[20px] bg-white p-5 border border-platinum-tint shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_12px_-3px_rgba(0,0,0,0.08)]"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.iconBg}`}>
              <IconComponent className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <span className="text-2xl font-bold text-slate-800 leading-tight truncate">{card.value}</span>
              <span className="text-[10px] text-slate-400 font-medium leading-none truncate">{card.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
