import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Bus, ChevronRight, Plus, ArrowRight } from 'lucide-react';
import type { CustomerBooking } from '../types/Booking';
import BookingStatusBadge from './BookingStatusBadge';
import { formatDate, formatCurrency } from '@/utils/formatter';

interface Props {
  bookings: CustomerBooking[];
}

export default function BookingList({ bookings }: Props) {
  const navigate = useNavigate();

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-cloud-mist border border-pale-gray">
          <Bus className="text-steel-gray" size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-bold text-midnight-indigo">Belum Ada Pemesanan</h3>
        <p className="mt-2 text-sm text-slate-blue max-w-xs leading-relaxed">
          Mulai perjalanan wisata Anda dengan membuat pemesanan bus pertama.
        </p>
        <button
          onClick={() => navigate('/customer/bookings/request')}
          className="mt-5 inline-flex items-center gap-2 px-5 py-3 bg-action-blue hover:bg-glacier-blue text-white rounded-xl text-sm font-bold shadow-md shadow-action-blue/20 transition-all cursor-pointer group"
        >
          <Plus size={15} strokeWidth={2.5} />
          Buat Pemesanan Sekarang
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="group flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-xl bg-cloud-mist/50 hover:bg-white border border-pale-gray hover:border-platinum-tint hover:shadow-[0_2px_12px_-4px_rgba(11,53,88,0.08)] transition-all duration-200 cursor-pointer"
          onClick={() => navigate(`/customer/bookings/${booking.id}`)}
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Bus icon */}
            <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-pale-gray text-steel-gray group-hover:border-platinum-tint group-hover:text-action-blue group-hover:bg-action-blue/5 transition-all duration-200">
              <Bus size={18} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black tracking-[0.15em] text-steel-gray uppercase">
                  #{booking.booking_code}
                </span>
                {booking.activity?.name && (
                  <>
                    <span className="text-pale-gray">·</span>
                    <span className="text-[11px] font-semibold text-slate-blue">{booking.activity.name}</span>
                  </>
                )}
              </div>
              <h3 className="text-sm font-bold text-midnight-indigo">{booking.origin}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-blue">
                <span className="flex items-center gap-1">
                  <Calendar size={11} className="text-steel-gray" />
                  {formatDate(booking.departure_date)}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={11} className="text-steel-gray" />
                  {booking.passenger_count} Penumpang
                </span>
                <span className="flex items-center gap-1">
                  <Bus size={11} className="text-steel-gray" />
                  {booking.bus_count_requested} Bus
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end w-full md:w-auto gap-3 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-pale-gray">
            {booking.transaction ? (
              <div className="text-left md:text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-steel-gray">Total Biaya</p>
                <p className="text-sm font-bold text-midnight-indigo mt-0.5">
                  {formatCurrency(booking.transaction.total_amount)}
                </p>
              </div>
            ) : (
              <div className="text-left md:text-right">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-steel-gray">Status Biaya</p>
                <p className="text-xs font-semibold text-slate-blue mt-0.5">Menunggu Penawaran</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <BookingStatusBadge status={booking.status} />
              <div className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg text-steel-gray group-hover:text-action-blue group-hover:bg-action-blue/5 transition-all duration-200">
                <ChevronRight size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
