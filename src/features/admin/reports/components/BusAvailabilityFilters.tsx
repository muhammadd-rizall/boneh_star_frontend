import React, { useRef } from "react";
import { Calendar, List } from "lucide-react";
import type { BusAvailabilityReportFilters } from "../types/BusAvailabilityReport";

interface BusAvailabilityFiltersProps {
  filters: BusAvailabilityReportFilters;
  onFilterChange: (newFilters: Partial<BusAvailabilityReportFilters>) => void;
  view: 'table' | 'timeline';
  onViewChange: (view: 'table' | 'timeline') => void;
}

export default function BusAvailabilityFilters({
  filters,
  onFilterChange,
  view,
  onViewChange,
}: BusAvailabilityFiltersProps) {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  
  const formatDateIndo = (dateStr?: string) => {
    if (!dateStr) return "Pilih tanggal";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    return `${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleOpenPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      try {
        ref.current.showPicker();
      } catch (err) {
        ref.current.click();
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] md:grid-cols-3">
      {/* Tanggal Mulai */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Mulai</label>
        <div 
          onClick={() => handleOpenPicker(startRef)}
          className="relative flex h-[52px] cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
        >
          <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
          <span className="text-sm font-semibold text-slate-700">{formatDateIndo(filters.start_date)}</span>
          <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={startRef}
            type="date"
            value={filters.start_date}
            onChange={(e) => onFilterChange({ start_date: e.target.value })}
            className="absolute inset-0 h-full w-full pointer-events-none opacity-0"
          />
        </div>
      </div>

      {/* Tanggal Selesai */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Selesai</label>
        <div 
          onClick={() => handleOpenPicker(endRef)}
          className="relative flex h-[52px] cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-4 transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
        >
          <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
          <span className="text-sm font-semibold text-slate-700">{formatDateIndo(filters.end_date)}</span>
          <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={endRef}
            type="date"
            value={filters.end_date}
            onChange={(e) => onFilterChange({ end_date: e.target.value })}
            className="absolute inset-0 h-full w-full pointer-events-none opacity-0"
          />
        </div>
      </div>

      {/* Tampilan Toggle */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tampilan</label>
        <div className="flex h-[52px] items-center rounded-xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => onViewChange('timeline')}
            className={`flex h-full flex-1 items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${
              view === 'timeline'
                ? "bg-indigo-50/70 text-indigo-600 border border-indigo-100/50 shadow-sm"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Kalender
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={`flex h-full flex-1 items-center justify-center gap-2 rounded-lg text-xs font-bold transition-all ${
              view === 'table'
                ? "bg-indigo-50/70 text-indigo-600 border border-indigo-100/50 shadow-sm"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}
          >
            <List className="h-4 w-4" />
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
}
