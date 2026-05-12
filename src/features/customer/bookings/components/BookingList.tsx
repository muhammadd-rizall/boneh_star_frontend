import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Bus, ChevronRight } from 'lucide-react';
import type { CustomerBooking } from '../types/Booking';
import { Card } from '@/components/ui/Card';
import BookingStatusBadge from './BookingStatusBadge';
import { formatDate } from '@/utils/formatter';

interface Props {
  bookings: CustomerBooking[];
}

export default function BookingList({ bookings }: Props) {
  const navigate = useNavigate();

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center shadow-sm">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
          <Calendar className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Belum ada pemesanan</h3>
        <p className="mt-1 text-sm text-slate-500 font-medium">Mulai perjalanan Anda dengan melakukan pemesanan pertama.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="group cursor-pointer transition-all hover:bg-slate-50 border-none shadow-md shadow-slate-100/60"
          onClick={() => navigate(`/customer/bookings/${booking.id}`)}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                  #{booking.booking_code}
                </span>
                <BookingStatusBadge status={booking.status} />
              </div>
              
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="p-1.5 rounded-lg bg-orange-50 text-orange-600">
                    <Calendar size={14} strokeWidth={2.5} />
                  </div>
                  {formatDate(booking.departure_date)}
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <MapPin size={14} strokeWidth={2.5} />
                  </div>
                  {booking.origin}
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                    <Users size={14} strokeWidth={2.5} />
                  </div>
                  {booking.passenger_count} Penumpang
                </div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600">
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                    <Bus size={14} strokeWidth={2.5} />
                  </div>
                  {booking.bus_count_requested} Bus
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4 sm:border-0 sm:pt-0">
              <div className="sm:hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kegiatan</p>
                <p className="text-xs font-bold text-slate-900">{booking.activity?.name}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-slate-950 group-hover:text-white transition-all">
                <ChevronRight size={20} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
