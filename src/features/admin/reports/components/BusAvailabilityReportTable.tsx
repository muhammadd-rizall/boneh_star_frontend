
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import type { BusAvailability, BusSchedule } from "../types/BusAvailabilityReport";
import { Calendar, Clock } from "lucide-react";
import { formatDateDMY } from "@/utils/formatter";

interface BusAvailabilityReportTableProps {
  data: BusAvailability[];
  loading?: boolean;
}

export default function BusAvailabilityReportTable({ data, loading }: BusAvailabilityReportTableProps) {
  const columns: Column<BusAvailability>[] = [
    {
      header: "Informasi Bus",
      accessor: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{row.name}</span>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">{row.plat_number}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row) => {
        const statusColors: Record<string, string> = {
          available: "bg-green-100 text-green-800",
          booked: "bg-blue-100 text-blue-800",
          maintenance: "bg-amber-100 text-amber-800",
          inactive: "bg-slate-100 text-slate-800",
        };
        const statusLabels: Record<string, string> = {
          available: "Tersedia",
          booked: "Dipesan",
          maintenance: "Perawatan",
          inactive: "Tidak Aktif",
        };
        const colorClass = statusColors[row.status] || "bg-slate-100 text-slate-800";
        const label = statusLabels[row.status] || row.status;
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            {label}
          </span>
        );
      },
    },
    {
      header: "Jadwal",
      accessor: (row) => (
        <div className="flex flex-col gap-2 py-2">
          {row.schedules.length === 0 ? (
            <span className="text-xs italic text-slate-400">Tidak ada pesanan pada periode ini</span>
          ) : (
            row.schedules.map((schedule: BusSchedule) => (
              <div 
                key={schedule.booking_id} 
                className="flex flex-col rounded-lg border border-slate-100 bg-slate-50/50 p-2 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-700">{schedule.booking_code}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    schedule.status === 'confirmed' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {schedule.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}
                  </span>
                </div>
                <div className="flex flex-col gap-1 text-slate-500">
                  <div className="flex items-center gap-1">
                     <Calendar size={10} />
                     <span>{formatDateDMY(schedule.departure_date)} - {schedule.return_date ? formatDateDMY(schedule.return_date) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    <span>{new Date(schedule.departure_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/90 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Ketersediaan Bus</h3>
          <p className="text-sm text-slate-500 mt-1">Status bus dan jadwal pemesanan armada</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            <span className="text-slate-600 font-medium">Tersedia</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
            <span className="text-slate-600 font-medium">Dipesan</span>
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={data} loading={loading} paginated />
    </div>
  );
}
