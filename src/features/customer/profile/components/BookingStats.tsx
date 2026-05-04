import { CalendarCheck, Clock, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react';
import type { BookingStatistics } from '../types/Profile';
import Card from '@/components/ui/Card';

interface Props {
  statistics: BookingStatistics;
}

export default function BookingStats({ statistics }: Props) {
  const stats = [
    {
      label: 'Total Pemesanan',
      value: statistics.total_bookings,
      icon: ShoppingBag,
      color: 'bg-slate-100 text-slate-600',
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
      color: 'bg-sky-50 text-sky-600',
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
        <Card key={stat.label} padding="sm" className="flex flex-col gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
            <stat.icon size={18} />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-slate-900">{stat.value}</p>
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
