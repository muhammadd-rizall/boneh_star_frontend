import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Bus, ChevronRight } from 'lucide-react';
import type { CustomerBooking } from '../types/Booking';
import Card from '@/components/ui/Card';
import BookingStatusBadge from './BookingStatusBadge';
import { formatDate } from '@/utils/formatter';

interface Props {
  bookings: CustomerBooking[];
}

export default function BookingList({ bookings }: Props) {
  const navigate = useNavigate();

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
          <Calendar className="text-slate-300" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900">Belum ada pemesanan</h3>
        <p className="mt-1 text-sm text-slate-500">Mulai petualangan Anda dengan melakukan pemesanan pertama.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="group cursor-pointer transition-all hover:border-orange-200 hover:shadow-md"
          onClick={() => navigate(`/customer/bookings/${booking.id}`)}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  #{booking.booking_code}
                </span>
                <BookingStatusBadge status={booking.status} />
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDate(booking.departure_date)}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <MapPin size={14} className="text-slate-400" />
                  {booking.origin}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Users size={14} className="text-slate-400" />
                  {booking.passenger_count} Penumpang
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Bus size={14} className="text-slate-400" />
                  {booking.bus_count_requested} Bus
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 pt-4 sm:border-0 sm:pt-0">
              <div className="sm:hidden">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kegiatan</p>
                <p className="text-xs font-bold text-slate-700">{booking.activity?.name}</p>
              </div>
              <ChevronRight size={20} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
