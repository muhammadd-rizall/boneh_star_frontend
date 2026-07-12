import type { BookingStatus } from '@/types/Database';

const statusMap: Record<BookingStatus, { label: string; className: string }> = {
  pending: { label: 'Menunggu', className: 'bg-amber-50 text-amber-600 border-amber-100' },
  quoted: { label: 'Menunggu Pembayaran', className: 'bg-sky-50 text-sky-600 border-sky-100' },
  confirmed: { label: 'Dikonfirmasi', className: 'bg-blue-50 text-blue-600 border-blue-100' },
  ongoing: { label: 'Berjalan', className: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  completed: { label: 'Selesai', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  cancelled: { label: 'Dibatalkan', className: 'bg-rose-50 text-rose-600 border-rose-100' },
};

export default function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const config = statusMap[status] || { label: status, className: 'bg-slate-50 text-slate-400 border-slate-100' };
  
  return (
    <span className={`inline-flex items-center rounded-xl border px-3 py-1 text-[9px] font-black uppercase tracking-[0.15em] ${config.className}`}>
      {config.label}
    </span>
  );
}
