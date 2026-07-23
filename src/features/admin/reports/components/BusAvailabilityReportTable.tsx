import { useState } from "react";
import type { BusAvailability } from "../types/BusAvailabilityReport";
import { 
  Calendar, Clock, Wrench, XCircle, ChevronRight, Plus, 
  MoreVertical, ChevronLeft, ChevronsLeft, ChevronsRight 
} from "lucide-react";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { useNavigate } from "react-router-dom";

interface BusAvailabilityReportTableProps {
  data: BusAvailability[];
  loading?: boolean;
}

export default function BusAvailabilityReportTable({ data, loading }: BusAvailabilityReportTableProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Formatting date to Indo format e.g. "30 Jul 2026"
  const formatDateIndo = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (dateStr?: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  // Pagination Math
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-5 select-none">
      {/* ── Section Header & Legend ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Daftar Armada</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">
            Status bus dan jadwal pemesanan armada pada periode yang dipilih.
          </p>
        </div>

        {/* Legend pills */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Tersedia</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Dipesan</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>Tidak Tersedia</span>
          </div>
        </div>
      </div>

      {/* ── Fleet List Cards ── */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 font-semibold border border-slate-200/80">
          Memuat data ketersediaan armada...
        </div>
      ) : currentData.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 font-semibold border border-slate-200/80">
          Tidak ada data armada ditemukan.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {currentData.map((bus) => {
            const latestSchedule = bus.schedules && bus.schedules.length > 0 ? bus.schedules[0] : null;
            const isBooked = bus.status === 'booked' || (latestSchedule !== null);
            const isMaintenance = bus.status === 'maintenance';
            const isInactive = bus.status === 'inactive' || bus.status === 'unavailable';

            return (
              <div 
                key={bus.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs hover:border-blue-200 hover:shadow-sm transition-all"
              >
                {/* 1. Left Column: Bus Thumbnail, Name, Specs, License Plate, and Status Badge */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  {/* Bus Thumbnail */}
                  <div className="h-14 w-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 shrink-0 flex items-center justify-center">
                    {bus.primary_image ? (
                      <img 
                        src={resolveMediaUrl(bus.primary_image)} 
                        alt={bus.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-400 font-extrabold text-xs">BUS</div>
                    )}
                  </div>

                  {/* Bus Info */}
                  <div className="flex flex-col">
                    <h3 className="text-sm font-black text-slate-900 leading-snug">{bus.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      {bus.category_name || "Medium Bus"} {bus.seat_count ? `| ${bus.seat_count} Seat` : ''}
                    </p>
                    <span className="inline-block self-start text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md mt-1.5 uppercase tracking-wider border border-slate-200/60">
                      {bus.plat_number}
                    </span>
                  </div>

                  {/* Status Badge next to info */}
                  <div className="ml-2">
                    {isMaintenance ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        <Wrench size={13} />
                        Maintenance
                      </span>
                    ) : isInactive ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        <XCircle size={13} />
                        Tidak Tersedia
                      </span>
                    ) : isBooked ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        Dipesan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Tersedia
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Middle Column: Booking / Schedule / Maintenance details */}
                <div className="flex flex-col justify-center min-w-[220px]">
                  {latestSchedule ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Booking Berikutnya
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {latestSchedule.booking_code}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-0.5">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>
                          {formatDateIndo(latestSchedule.departure_date)} - {formatDateIndo(latestSchedule.return_date)}
                        </span>
                      </div>
                      {formatTime(latestSchedule.departure_date) && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                          <Clock size={12} className="text-slate-400 shrink-0" />
                          <span>{formatTime(latestSchedule.departure_date)}</span>
                        </div>
                      )}
                    </div>
                  ) : isMaintenance ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Perawatan Terjadwal
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        Perawatan rutin berkala
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-1">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>{formatDateIndo(new Date().toISOString())}</span>
                      </div>
                    </div>
                  ) : isInactive ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Status
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        Tidak dapat digunakan
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-extrabold text-slate-800">
                        Tidak ada pemesanan
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Bus siap digunakan
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. Right Column: Status Tag, Action Buttons, and Menu */}
                <div className="flex items-center justify-between md:justify-end gap-3 min-w-[200px]">
                  {latestSchedule ? (
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                        latestSchedule.status === 'confirmed' 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {latestSchedule.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}
                      </span>

                      <button
                        onClick={() => navigate(`/admin/bookings?search=${latestSchedule.booking_code}`)}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                      >
                        <span>Lihat Detail</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  ) : !isMaintenance && !isInactive ? (
                    <button
                      onClick={() => navigate('/admin/bookings')}
                      className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100 text-xs font-bold text-blue-600 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                    >
                      <span>Buat Booking</span>
                      <Plus size={14} />
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 mr-4">-</span>
                  )}

                  <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination Footer (Identical to Calendar view timeline) ── */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 sm:px-6 shadow-xs">
        <span className="text-xs font-semibold text-slate-500 select-none">
          Menampilkan <strong className="text-slate-800">{startIndex}-{endIndex}</strong> dari <strong className="text-slate-800">{totalItems}</strong> data
        </span>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* First Page button << */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 shadow-xs transition-colors hover:bg-slate-50 disabled:bg-slate-50/40 disabled:text-slate-300 disabled:border-slate-100/50 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronsLeft className="h-4 w-4 shrink-0" />
            </button>
            
            {/* Prev Page button < */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 shadow-xs transition-colors hover:bg-slate-50 disabled:bg-slate-50/40 disabled:text-slate-300 disabled:border-slate-100/50 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
            </button>
            
            {/* Page number buttons */}
            {Array.from({ length: totalPages }, (_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0066FF] border-[#0066FF] text-white font-bold shadow-xs"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {/* Next Page button > */}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 shadow-xs transition-colors hover:bg-slate-50 disabled:bg-slate-50/40 disabled:text-slate-300 disabled:border-slate-100/50 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 shrink-0" />
            </button>
            
            {/* Last Page button >> */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 shadow-xs transition-colors hover:bg-slate-50 disabled:bg-slate-50/40 disabled:text-slate-300 disabled:border-slate-100/50 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronsRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
