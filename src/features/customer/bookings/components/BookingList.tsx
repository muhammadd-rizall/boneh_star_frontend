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
      <div className="flex flex-col items-center justify-center rounded-[16px] border-2 border-dashed border-platinum-tint bg-white py-24 text-center shadow-sm">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cloud-mist border border-platinum-tint/50">
          <Calendar className="text-slate-blue/40" size={36} strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-midnight-indigo">Belum ada pemesanan</h3>
        <p className="mt-2 text-sm font-medium text-slate-blue">Mulai perjalanan Anda dengan melakukan pemesanan pertama.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {bookings.map((booking) => (
        <Card
          key={booking.id}
          className="group cursor-pointer transition-all duration-300 hover:border-action-blue/40 border border-platinum-tint shadow-sm hover:shadow-card bg-white overflow-hidden rounded-[16px]"
          onClick={() => navigate(`/customer/bookings/${booking.id}`)}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black tracking-widest text-slate-blue/60 uppercase bg-cloud-mist px-3 py-1.5 rounded-lg border border-platinum-tint/50">
                  #{booking.booking_code}
                </span>
                <BookingStatusBadge status={booking.status} />
              </div>
              
              <div className="flex flex-wrap gap-x-8 gap-y-3 mt-2">
                <div className="flex items-center gap-2.5 text-[13px] font-bold text-midnight-indigo">
                  <div className="p-2 rounded-xl bg-cloud-mist text-slate-blue group-hover:text-action-blue group-hover:bg-action-blue/5 transition-colors">
                    <Calendar size={16} strokeWidth={2} />
                  </div>
                  {formatDate(booking.departure_date)}
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-bold text-midnight-indigo">
                  <div className="p-2 rounded-xl bg-cloud-mist text-slate-blue group-hover:text-action-blue group-hover:bg-action-blue/5 transition-colors">
                    <MapPin size={16} strokeWidth={2} />
                  </div>
                  {booking.origin}
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-bold text-midnight-indigo">
                  <div className="p-2 rounded-xl bg-cloud-mist text-slate-blue group-hover:text-action-blue group-hover:bg-action-blue/5 transition-colors">
                    <Users size={16} strokeWidth={2} />
                  </div>
                  {booking.passenger_count} Penumpang
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-bold text-midnight-indigo">
                  <div className="p-2 rounded-xl bg-cloud-mist text-slate-blue group-hover:text-action-blue group-hover:bg-action-blue/5 transition-colors">
                    <Bus size={16} strokeWidth={2} />
                  </div>
                  {booking.bus_count_requested} Bus
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-platinum-tint/50 pt-5 sm:border-0 sm:pt-0">
              <div className="sm:hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-blue/60">Kegiatan</p>
                <p className="text-xs font-bold text-midnight-indigo">{booking.activity?.name}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cloud-mist text-slate-blue group-hover:bg-action-blue group-hover:text-white transition-all duration-300 shadow-sm border border-platinum-tint/50 group-hover:border-action-blue">
                <ChevronRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
