import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useBookings } from '@/features/customer/bookings/hooks/useBookings';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import BookingStatusBadge from '@/features/customer/bookings/components/BookingStatusBadge';
import {
  Plus, Briefcase, Clock, CalendarCheck, CheckCircle2,
  ChevronRight, Bus, Shield, MessageCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatter';
import type { CustomerBooking } from '@/features/customer/bookings/types/Booking';

// ── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'stats',   label: 'Statistik' },
  { id: 'pending', label: 'Pengajuan' },
  { id: 'offers',  label: 'Penawaran' },
  { id: 'history', label: 'Riwayat' },
  { id: 'new',     label: 'Buat Pemesanan', isAction: true },
] as const;

export default function BookingIndexPage() {
  const { bookings, loading, error, refresh } = useBookings();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') ?? 'stats';

  React.useEffect(() => {
    if (activeTab === 'new') navigate('/customer/bookings/request');
  }, [activeTab, navigate]);

  if (loading) return (
    <CustomerLayout>
      <div className="flex min-h-[40vh] items-center justify-center"><Loader /></div>
    </CustomerLayout>
  );

  const pending   = bookings.filter(b => b.status === 'pending');
  const quoted    = bookings.filter(b => b.status === 'quoted');
  const completed = bookings.filter(b => b.status === 'completed');
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const bookingsWithTransaction = bookings.filter(b => b.transaction);

  const totalSpent = bookingsWithTransaction
    .reduce((sum, b) => sum + (b.transaction?.total_amount ?? 0), 0);

  const avgPerBooking = bookingsWithTransaction.length > 0
    ? totalSpent / bookingsWithTransaction.length
    : 0;

  const getTabList = () => {
    switch (activeTab) {
      case 'pending': return pending;
      case 'offers':  return quoted;
      case 'history': return [...completed, ...cancelled];
      default:        return recentBookings;
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-screen-xl mx-auto">

      {/* ── Page Title ── */}
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Pemesanan</h1>
        <p className="text-sm text-slate-blue mt-0.5">
          Kelola semua pemesanan perjalanan Anda dengan mudah.
        </p>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-1 border-b border-pale-gray mb-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          if (tab.id === 'new') return (
            <button
              key="new"
              onClick={() => navigate('/customer/bookings/request')}
              className="ml-auto flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-action-blue hover:bg-action-blue/5 rounded-t-lg transition-colors cursor-pointer border border-b-0 border-transparent hover:border-pale-gray"
            >
              <Plus size={14} strokeWidth={2.5} />
              Buat Pemesanan
            </button>
          );
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSearchParams({ tab: tab.id })}
              className={[
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px",
                isActive
                  ? "border-action-blue text-action-blue"
                  : "border-transparent text-slate-blue hover:text-gray-800 hover:border-pale-gray",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab: Statistik ── */}
      {activeTab === 'stats' && (
        <div className="flex flex-col gap-5">

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard value={bookings.length} label="Total Pemesanan"   sub="Semua waktu"          color="bg-action-blue"  icon={Briefcase} />
            <StatCard value={pending.length}  label="Pengajuan"         sub="Menunggu respon"      color="bg-amber-400"    icon={Clock} />
            <StatCard value={quoted.length}   label="Penawaran"         sub="Menunggu persetujuan" color="bg-action-blue"  icon={CalendarCheck} />
            <StatCard value={completed.length} label="Selesai"          sub="Selesai perjalanan"   color="bg-emerald-500" icon={CheckCircle2} />
          </div>

          {/* Pemesanan Terbaru — full width */}
          <div className="bg-white rounded-2xl border border-pale-gray shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-pale-gray">
              <h2 className="text-sm font-bold text-gray-900">Pemesanan Terbaru</h2>
              <button
                onClick={() => setSearchParams({ tab: 'history' })}
                className="text-xs font-semibold text-action-blue hover:underline cursor-pointer"
              >
                Lihat Semua Riwayat
              </button>
            </div>
            {error ? (
              <div className="p-5"><ErrorState message={error} onRetry={refresh} /></div>
            ) : recentBookings.length === 0 ? (
              <EmptyState onRequest={() => navigate('/customer/bookings/request')} />
            ) : (
              <div className="divide-y divide-pale-gray">
                {recentBookings.map(b => <BookingRow key={b.id} booking={b} onView={() => navigate(`/customer/bookings/${b.id}`)} />)}
              </div>
            )}
          </div>

          {/* Info row: 3 cards side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Ringkasan Pengeluaran */}
            <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">Ringkasan</h3>
                <span className="text-[10px] font-semibold text-slate-blue bg-cloud-mist px-2 py-1 rounded-lg">Semua Waktu</span>
              </div>
              <p className="text-[10px] font-semibold text-steel-gray uppercase tracking-wider mb-0.5">Total Pengeluaran</p>
              <p className="text-lg font-black text-gray-900 mb-3">{formatCurrency(totalSpent)}</p>
              <p className="text-[10px] font-semibold text-steel-gray uppercase tracking-wider mb-0.5">Rata-rata / Pesanan</p>
              <p className="text-base font-black text-gray-900 mb-3">{formatCurrency(avgPerBooking)}</p>
              <div className="flex items-center justify-between py-2 border-t border-pale-gray">
                <span className="text-xs text-slate-blue">Selesai</span>
                <span className="text-xs font-bold text-gray-900">{completed.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-pale-gray">
                <span className="text-xs text-slate-blue">Dibatalkan</span>
                <span className="text-xs font-bold text-gray-900">{cancelled.length}</span>
              </div>
            </div>

            {/* Aksi Cepat */}
            <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Aksi Cepat</h3>
              <div className="flex flex-col gap-1">
                <QuickAction
                  icon={Plus}
                  label="Buat Pemesanan"
                  sub="Pesan bus perjalanan Anda"
                  onClick={() => navigate('/customer/bookings/request')}
                />
                <QuickAction
                  icon={Bus}
                  label="Cek Armada"
                  sub="Lihat jadwal & armada"
                  onClick={() => navigate('/customer/bookings/request')}
                />
                <QuickAction
                  icon={MessageCircle}
                  label="Hubungi Kami"
                  sub="Chat dengan tim kami"
                  onClick={() => navigate('/customer/notifications')}
                />
              </div>
            </div>

            {/* Trust + info */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                <Shield size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">Aman &amp; Terpercaya</p>
                  <p className="text-xs text-emerald-600 mt-1 leading-relaxed">
                    Data pemesanan Anda aman bersama kami. Kami menggunakan sistem enkripsi terbaik.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/customer/bookings/request')}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-action-blue text-white text-sm font-bold hover:bg-glacier-blue transition-colors cursor-pointer"
              >
                <Plus size={15} strokeWidth={2.5} />
                Buat Pemesanan Baru
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Other tabs: list view ── */}
      {activeTab !== 'stats' && (
        <div className="bg-white rounded-2xl border border-pale-gray shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-pale-gray flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              {activeTab === 'pending' ? 'Pengajuan' : activeTab === 'offers' ? 'Penawaran' : 'Riwayat Pemesanan'}
            </h2>
            <span className="text-xs font-semibold text-slate-blue bg-cloud-mist px-2 py-1 rounded-lg">
              {getTabList().length} data
            </span>
          </div>
          {error ? (
            <div className="p-5"><ErrorState message={error} onRetry={refresh} /></div>
          ) : getTabList().length === 0 ? (
            <EmptyState onRequest={() => navigate('/customer/bookings/request')} />
          ) : (
            <div className="divide-y divide-pale-gray">
              {getTabList().map(b => (
                <BookingRow key={b.id} booking={b} onView={() => navigate(`/customer/bookings/${b.id}`)} />
              ))}
            </div>
          )}
        </div>
      )}

    </div>
    </CustomerLayout>
  );
}

// ── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, sub, color, icon: Icon }: {
  value: number; label: string; sub: string; color: string; icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color} bg-opacity-10`}>
          <Icon size={16} className={color.replace('bg-', 'text-')} strokeWidth={2} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-gray-900">{value}</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">{label}</p>
        <p className="text-xs text-steel-gray mt-0.5">{sub}</p>
      </div>
      {/* Bottom color bar */}
      <div className={`h-1 rounded-full ${color}`} />
    </div>
  );
}

// ── BookingRow ────────────────────────────────────────────────────────────────
function BookingRow({ booking, onView }: { booking: CustomerBooking; onView: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:px-5 sm:py-4 hover:bg-cloud-mist/50 transition-colors cursor-pointer group" onClick={onView}>
      
      {/* Top row / Left section: Image and details */}
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        {/* Placeholder thumbnail */}
        <div className="h-11 w-11 shrink-0 rounded-xl bg-pale-gray flex items-center justify-center">
          <Bus size={20} className="text-slate-500" strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 truncate">
            {booking.activity?.name ?? booking.origin ?? 'Pemesanan Bus'}
          </p>
          <p className="text-xs text-slate-blue mt-0.5">
            {formatDate(booking.departure_date)}
            {booking.passenger_count && ` · ${booking.passenger_count} Kursi`}
            {booking.bus_count_requested && ` · ${booking.bus_count_requested > 1 ? 'Big Bus' : 'Medium Bus'}`}
          </p>
          {booking.transaction && (
            <p className="text-xs font-black text-[#006bff] mt-1 sm:hidden">
              {formatCurrency(booking.transaction.total_amount)}
            </p>
          )}
        </div>
      </div>

      {/* Bottom row / Right section: Status badge, Price & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2.5 sm:pt-0 border-t border-dashed border-pale-gray sm:border-none">
        <div className="flex items-center gap-3">
          <BookingStatusBadge status={booking.status} />
          {booking.transaction && (
            <div className="hidden sm:block text-right shrink-0">
              <p className="text-sm font-black text-gray-900">
                {formatCurrency(booking.transaction.total_amount)}
              </p>
            </div>
          )}
        </div>

        <button
          className="px-3.5 py-1.5 rounded-lg border border-pale-gray text-xs font-semibold text-slate-blue hover:border-action-blue hover:text-action-blue transition-colors cursor-pointer bg-white shadow-sm"
          onClick={(e) => { e.stopPropagation(); onView(); }}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState({ onRequest }: { onRequest: () => void }) {
  return (
    <div className="flex flex-col items-center py-12 text-center px-5">
      <div className="h-14 w-14 rounded-2xl bg-cloud-mist border border-pale-gray flex items-center justify-center mb-3">
        <Bus size={24} className="text-steel-gray" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-bold text-gray-800">Belum ada pemesanan</p>
      <p className="text-xs text-slate-blue mt-1 mb-4">Mulai perjalanan wisata Anda sekarang</p>
      <button
        onClick={onRequest}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-action-blue text-white text-sm font-bold hover:bg-glacier-blue transition-colors cursor-pointer"
      >
        <Plus size={14} strokeWidth={2.5} />
        Buat Pemesanan
      </button>
    </div>
  );
}

// ── QuickAction ───────────────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, sub, onClick }: {
  icon: React.ElementType; label: string; sub: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-cloud-mist transition-colors cursor-pointer text-left group"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cloud-mist border border-pale-gray group-hover:bg-white">
        <Icon size={15} className="text-action-blue" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-gray-800">{label}</p>
        <p className="text-[11px] text-slate-blue">{sub}</p>
      </div>
      <ChevronRight size={13} className="text-steel-gray shrink-0" />
    </button>
  );
}
