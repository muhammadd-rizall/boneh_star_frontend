import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import type { Booking } from "@/features/admin/bookings/types/Booking";
import { cn } from "@/lib/utils";

interface ReportTableProps {
  data: Booking[];
  loading?: boolean;
}

export default function ReportTable({ data, loading }: ReportTableProps) {
  const columns: Column<Booking>[] = [
    {
      header: "Kode Booking",
      accessor: (row) => (
        <span className="font-bold text-midnight-indigo">{row.booking_code}</span>
      ),
    },
    {
      header: "Pelanggan",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-midnight-indigo">{row.customer?.name}</span>
          <span className="text-[11px] font-bold text-slate-blue opacity-50">{row.customer?.phone}</span>
        </div>
      ),
    },
    {
      header: "Keberangkatan",
      accessor: (row) => (
        <span className="text-xs font-bold text-slate-blue opacity-80">
          {new Date(row.departure_date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      ),
    },
    {
      header: "Asal",
      accessor: (row) => (
        <span className="text-xs font-bold text-midnight-indigo">{row.origin}</span>
      ),
    },
    {
      header: "Penumpang",
      accessor: (row) => (
        <span className="text-xs font-bold text-midnight-indigo">{row.passenger_count} Orang</span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => {
        const statusColors = {
          pending: "border-amber-200 bg-amber-50 text-amber-700",
          quoted: "border-blue-200 bg-blue-50 text-blue-700",
          confirmed: "border-emerald-200 bg-emerald-50 text-emerald-700",
          ongoing: "border-indigo-200 bg-indigo-50 text-indigo-700",
          completed: "border-slate-200 bg-slate-50 text-slate-700",
          cancelled: "border-rose-200 bg-rose-50 text-rose-700",
        };
        const statusLabels = {
          pending: "Tertunda",
          quoted: "Ditawarkan",
          confirmed: "Dikonfirmasi",
          ongoing: "Sedang Jalan",
          completed: "Selesai",
          cancelled: "Dibatalkan",
        };
        return (
          <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
            statusColors[row.status]
          )}>
            {statusLabels[row.status]}
          </span>
        );
      },
    },
  ];

  return (
    <div className="rounded-[32px] border border-platinum-tint bg-white overflow-hidden shadow-card">
      <div className="p-8 border-b border-platinum-tint/50">
        <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Rincian Item Laporan</h3>
        <p className="text-sm font-medium text-slate-blue opacity-60 mt-1">Daftar lengkap transaksi dalam rentang waktu yang dipilih</p>
      </div>
      <DataTable columns={columns} data={data} loading={loading} paginated />
    </div>
  );
}
