import type { BookingStatus } from '@/types/Database';

const statusMap: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: 'Menunggu', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  quoted: { label: 'Penawaran Harga', className: 'bg-violet-50 text-violet-700 border-violet-200' },
  confirmed: { label: 'Dikonfirmasi', className: 'bg-sky-50 text-sky-700 border-sky-200' },
  ongoing: { label: 'Berjalan', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Selesai', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  cancelled: { label: 'Dibatalkan', className: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = statusMap[status] || { label: status, className: 'bg-slate-50 text-slate-600 border-slate-200' };
  
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${config.className}`}>
      {config.label}
    </span>
  );
}
