import { CalendarCheck, Clock, CheckCircle2, XCircle, ShoppingBag } from 'lucide-react';
import type { BookingStatistics } from '../types/Profile';
import Card from '@/components/ui/Card';

interface Props {
  statistics: BookingStatistics;
}

export default function BookingStats({ statistics }: Props) {
  const stats = [
    {
      label: 'Total Pesanan',
      value: statistics.total_bookings,
      icon: ShoppingBag,
      color: 'bg-slate-50 text-slate-900',
    },
    {
      label: 'Menunggu',
      value: statistics.pending,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: 'Dikonfirmasi',
      value: statistics.confirmed,
      icon: CalendarCheck,
      color: 'bg-blue-50 text-blue-600',
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
        <Card key={stat.label} padding="sm" className="flex flex-col gap-4 border-none shadow-md shadow-slate-100/50">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>
            <stat.icon size={20} />
          </div>
          <div>
            <p className="text-3xl font-black tracking-tighter text-slate-950">{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
