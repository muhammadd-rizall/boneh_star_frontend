
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import type { Booking } from "@/types/Database";

interface ReportTableProps {
  data: Booking[];
  loading?: boolean;
}

export default function ReportTable({ data, loading }: ReportTableProps) {
  const columns: Column<Booking>[] = [
    {
      header: "Booking Code",
      accessor: (row) => (
        <span className="font-semibold text-slate-900">{row.booking_code}</span>
      ),
    },
    {
      header: "Customer",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-700">{row.customer?.name}</span>
          <span className="text-xs text-slate-500">{row.customer?.phone}</span>
        </div>
      ),
    },
    {
      header: "Departure",
      accessor: (row) => (
        <span className="text-sm text-slate-600">
          {new Date(row.departure_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Origin",
      accessor: (row) => (
        <span className="text-sm text-slate-600">{row.origin}</span>
      ),
    },
    {
      header: "Passengers",
      accessor: (row) => (
        <span className="text-sm font-medium text-slate-700">{row.passenger_count}</span>
      ),
    },
    {
      header: "Status",
      accessor: (row) => {
        const statusColors = {
          pending: "bg-amber-100 text-amber-800",
          quoted: "bg-blue-100 text-blue-800",
          confirmed: "bg-indigo-100 text-indigo-800",
          ongoing: "bg-purple-100 text-purple-800",
          completed: "bg-green-100 text-green-800",
          cancelled: "bg-red-100 text-red-800",
        };
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status]}`}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/90 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-900">Detailed Report Items</h3>
        <p className="text-sm text-slate-500 mt-1">Full list of bookings within selected range</p>
      </div>
      <DataTable columns={columns} data={data} loading={loading} paginated />
    </div>
  );
}
