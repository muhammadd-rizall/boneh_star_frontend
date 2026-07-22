import React, { useState } from 'react';
import type { BusAvailability } from "../types/BusAvailabilityReport";
import { Card } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info, Check, Wrench, X } from 'lucide-react';

interface BusAvailabilityTimelineProps {
  data: BusAvailability[];
  period: {
    start_date: string;
    end_date: string;
  };
  filters: {
    start_date: string;
    end_date: string;
  };
  onFilterChange: (newFilters: { start_date: string; end_date: string }) => void;
}

export default function BusAvailabilityTimeline({ 
  data, 
  period, 
  filters, 
  onFilterChange 
}: BusAvailabilityTimelineProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeBooking, setActiveBooking] = useState<{
    schedule: any;
    bus: BusAvailability;
  } | null>(null);

  const itemsPerPage = 6;

  const start = new Date(period.start_date);
  const end = new Date(period.end_date);
  
  // Generate dates array
  const dates: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };

  const getScheduleDetailsForDate = (bus: BusAvailability, date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    
    const schedule = bus.schedules.find(s => {
      const sStart = new Date(s.departure_date);
      sStart.setHours(0, 0, 0, 0);
      const sEnd = s.return_date ? new Date(s.return_date) : sStart;
      sEnd.setHours(0, 0, 0, 0);
      
      return d >= sStart && d <= sEnd;
    });

    if (!schedule) return null;

    const sStart = new Date(schedule.departure_date);
    sStart.setHours(0, 0, 0, 0);
    const sEnd = schedule.return_date ? new Date(schedule.return_date) : sStart;
    sEnd.setHours(0, 0, 0, 0);

    return {
      schedule,
      isStart: d.getTime() === sStart.getTime(),
      isEnd: d.getTime() === sEnd.getTime()
    };
  };

  const formatPeriodRange = () => {
    if (!period.start_date || !period.end_date) return "";
    const startD = new Date(period.start_date);
    const endD = new Date(period.end_date);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    
    if (startD.getFullYear() === endD.getFullYear()) {
      if (startD.getMonth() === endD.getMonth()) {
        return `${startD.getDate()} - ${endD.getDate()} ${months[startD.getMonth()]} ${startD.getFullYear()}`;
      }
      return `${startD.getDate()} ${months[startD.getMonth()]} - ${endD.getDate()} ${months[endD.getMonth()]} ${startD.getFullYear()}`;
    }
    return `${startD.getDate()} ${months[startD.getMonth()]} ${startD.getFullYear()} - ${endD.getDate()} ${months[endD.getMonth()]} ${endD.getFullYear()}`;
  };

  const formatDateLong = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handlePrevPeriod = () => {
    const startMs = new Date(filters.start_date).getTime();
    const endMs = new Date(filters.end_date).getTime();
    const diff = endMs - startMs + 86400000;
    
    const newStart = new Date(startMs - diff);
    const newEnd = new Date(endMs - diff);
    
    onFilterChange({
      start_date: newStart.toISOString().split('T')[0],
      end_date: newEnd.toISOString().split('T')[0],
    });
  };

  const handleNextPeriod = () => {
    const startMs = new Date(filters.start_date).getTime();
    const endMs = new Date(filters.end_date).getTime();
    const diff = endMs - startMs + 86400000;
    
    const newStart = new Date(startMs + diff);
    const newEnd = new Date(endMs + diff);
    
    onFilterChange({
      start_date: newStart.toISOString().split('T')[0],
      end_date: newEnd.toISOString().split('T')[0],
    });
  };

  // Pagination calculation
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedBuses = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const startIndex = data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endIndex = Math.min(currentPage * itemsPerPage, data.length);

  const fallbackBusImage = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=120&auto=format&fit=crop";

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-[24px]">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-100 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-base font-bold text-slate-800">Ketersediaan Armada</h3>
          <p className="text-xs text-slate-400 mt-1">Klik pada tanggal untuk melihat detail pemesanan</p>
        </div>

        {/* Date Navigator & Legend */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button 
                onClick={handlePrevPeriod}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={handleNextPeriod}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm font-bold text-slate-700">{formatPeriodRange()}</span>
          </div>

          {/* Color Indicators Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Tersedia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span>Dipesan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span>Maintenance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span>Tidak Tersedia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Table Timeline */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="sticky left-0 z-20 min-w-[280px] max-w-[280px] border-b border-r border-slate-100 bg-slate-50 p-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                Armada / Unit
              </th>
              {dates.map((date, i) => {
                const weekend = isWeekend(date);
                return (
                  <th 
                    key={i} 
                    className={`min-w-[50px] border-b border-r border-slate-100 p-2 text-center text-xs ${
                      weekend ? "bg-red-50/30" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-base font-bold leading-tight ${weekend ? "text-red-500" : "text-slate-700"}`}>
                        {date.getDate()}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${weekend ? "text-red-400" : "text-slate-400"}`}>
                        {date.toLocaleDateString('id-ID', { weekday: 'short' })}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedBuses.map((bus) => (
              <tr key={bus.id} className="hover:bg-slate-50/30 transition-colors">
                {/* Bus Info Sticky Column */}
                <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={bus.primary_image || fallbackBusImage} 
                      alt={bus.name}
                      className="w-12 h-10 object-cover rounded-lg border border-slate-100 shrink-0" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackBusImage;
                      }}
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-slate-800 truncate leading-tight">{bus.name}</span>
                      <span className="text-[10px] font-semibold text-slate-400 leading-normal truncate mt-0.5">
                        {bus.category_name || "Premium Bus"} | {bus.seat_count || 47} Seat
                      </span>
                      <div className="mt-1">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider font-mono leading-none">
                          {bus.plat_number}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Timeline cells */}
                {dates.map((date, i) => {
                  const weekend = isWeekend(date);
                  
                  // 1. Check if bus is in maintenance status for the whole period
                  if (bus.status === 'maintenance') {
                    return (
                      <td key={i} className="border-b border-r border-slate-100 p-0 h-[64px] relative">
                        <div className="absolute inset-y-1 inset-x-0.5 bg-orange-500 rounded flex items-center justify-center text-white shadow-sm">
                          <Wrench className="h-3.5 w-3.5" />
                        </div>
                      </td>
                    );
                  }

                  // 2. Check schedule status
                  const details = getScheduleDetailsForDate(bus, date);

                  if (details) {
                    const { schedule, isStart, isEnd } = details;
                    const isConfirmed = schedule.status === 'confirmed' || schedule.status === 'completed';
                    
                    if (isConfirmed) {
                      // Dipesan: Blue Block
                      const roundedClass = isStart && isEnd 
                        ? "rounded-md mx-1" 
                        : isStart 
                          ? "rounded-l-md ml-1" 
                          : isEnd 
                            ? "rounded-r-md mr-1" 
                            : "rounded-none";

                      return (
                        <td key={i} className="border-b border-r border-slate-100 p-0 h-[64px] relative bg-blue-50/10">
                          <div 
                            onClick={() => setActiveBooking({ schedule, bus })}
                            className={`absolute inset-y-1 inset-x-0 bg-blue-600 text-white flex items-center justify-center shadow-sm select-none cursor-pointer transition-transform hover:scale-[1.02] hover:brightness-95 active:scale-[0.98] ${roundedClass}`}
                            title={`${schedule.booking_code} (${schedule.status === 'confirmed' ? 'Dikonfirmasi' : 'Selesai'}) - Klik untuk detail`}
                          >
                            {isStart && (
                              <span className="text-[9px] font-bold px-1.5 truncate text-white leading-none">
                                {schedule.booking_code.split('-').pop()}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    } else {
                      // Tidak Tersedia: Gray Block with 'X'
                      return (
                        <td key={i} className="border-b border-r border-slate-100 p-0 h-[64px] relative bg-slate-50/30">
                          <div className="absolute inset-y-1 inset-x-0.5 bg-slate-200 text-slate-500 rounded flex items-center justify-center shadow-sm">
                            <X className="h-3.5 w-3.5" />
                          </div>
                        </td>
                      );
                    }
                  }

                  // 3. Available Cell: Green Check Circle
                  return (
                    <td 
                      key={i} 
                      className={`border-b border-r border-slate-100 p-0 h-[64px] relative ${
                        weekend ? "bg-red-50/10" : ""
                      }`}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 shadow-sm">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alert Information Banner (Full Width above footer to prevent squeezing) */}
      <div className="px-6 py-3.5 bg-blue-50/45 border-t border-slate-100 flex items-center gap-2 text-xs text-blue-600">
        <Info className="h-4 w-4 text-blue-500 shrink-0" />
        <span>Klik pada sel tanggal yang berstatus Dipesan untuk melihat detail pemesanan.</span>
      </div>

      {/* Pagination & Stats Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:px-6">
        <span className="text-xs font-semibold text-slate-500 select-none">
          Menampilkan <strong className="text-slate-800">{startIndex}-{endIndex}</strong> dari <strong className="text-slate-800">{data.length}</strong> unit armada
        </span>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {/* First Page button << */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:bg-slate-50/40 disabled:text-slate-300 disabled:border-slate-100/50 disabled:pointer-events-none"
            >
              <ChevronsLeft className="h-4 w-4 shrink-0" />
            </button>
            
            {/* Prev Page button < */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:bg-slate-50/40 disabled:text-slate-300 disabled:border-slate-100/50 disabled:pointer-events-none"
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
                  className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#0066FF] border-[#0066FF] text-white font-bold"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {/* Next Page button > */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:bg-slate-50/40 disabled:text-slate-300 disabled:border-slate-100/50 disabled:pointer-events-none"
            >
              <ChevronRight className="h-4 w-4 shrink-0" />
            </button>
            
            {/* Last Page button >> */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[12px] border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 disabled:bg-slate-50/40 disabled:text-slate-300 disabled:border-slate-100/50 disabled:pointer-events-none"
            >
              <ChevronsRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        )}
      </div>

      {/* Booking Detail Modal Overlay */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 relative animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-base font-bold text-slate-800">Detail Pemesanan</h4>
                <p className="text-xs text-slate-400 mt-0.5">Kode Booking: #{activeBooking.schedule.booking_code}</p>
              </div>
              <button 
                onClick={() => setActiveBooking(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 -mx-6" />

            {/* Body */}
            <div className="flex flex-col gap-4">
              {/* Bus Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <img 
                  src={activeBooking.bus.primary_image || fallbackBusImage} 
                  alt={activeBooking.bus.name}
                  className="w-14 h-11 object-cover rounded-lg border border-slate-200 shrink-0" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackBusImage;
                  }}
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-800 truncate">{activeBooking.bus.name}</span>
                  <span className="text-xs text-slate-400 truncate mt-0.5">
                    {activeBooking.bus.category_name || "Premium Bus"} | {activeBooking.bus.seat_count || 47} Seat
                  </span>
                  <div className="mt-1">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider font-mono leading-none">
                      {activeBooking.bus.plat_number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Schedule Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 p-3 rounded-xl border border-slate-100 bg-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keberangkatan</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5">
                    {formatDateLong(activeBooking.schedule.departure_date)}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-xl border border-slate-100 bg-white">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kepulangan</span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5">
                    {formatDateLong(activeBooking.schedule.return_date)}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                <span className="text-xs font-bold text-slate-500">Status Pemesanan</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                  activeBooking.schedule.status === 'confirmed' || activeBooking.schedule.status === 'completed'
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}>
                  {activeBooking.schedule.status === 'confirmed' ? 'Dikonfirmasi' : 
                   activeBooking.schedule.status === 'completed' ? 'Selesai' : activeBooking.schedule.status}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 -mx-6" />

            {/* Footer Actions */}
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setActiveBooking(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
              >
                Tutup
              </button>
              <a
                href={`/admin/bookings?search=${activeBooking.schedule.booking_code}`}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700 flex items-center justify-center"
              >
                Lihat Selengkapnya
              </a>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
