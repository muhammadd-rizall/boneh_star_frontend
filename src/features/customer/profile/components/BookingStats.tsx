import { CalendarCheck, Clock, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react';
import type { BookingStatistics } from '../types/Profile';

interface Props {
  statistics: BookingStatistics;
}

export default function BookingStats({ statistics }: Props) {
  const stats = [
    {
      label: 'Total Pesanan',
      value: statistics.total_bookings,
      icon: ShoppingBag,
      color: 'bg-slate-100 text-midnight-indigo',
    },
    {
      label: 'Menunggu',
      value: statistics.pending,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      label: 'Dikonfirmasi',
      value: statistics.confirmed,
      icon: CalendarCheck,
      color: 'bg-action-blue/10 text-action-blue',
    },
    {
      label: 'Selesai',
      value: statistics.completed,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Dibatalkan',
      value: statistics.cancelled,
      icon: XCircle,
      color: 'bg-rose-50 text-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <div 
          key={stat.label} 
          className="flex flex-col gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]"
        >
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
            <stat.icon size={18} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-midnight-indigo leading-none">{stat.value}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
