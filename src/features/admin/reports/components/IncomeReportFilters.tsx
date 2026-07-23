import React, { useRef } from "react";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Calendar, Filter } from "lucide-react";
import type { IncomeReportFilters as FiltersType } from "../types/IncomeReport";

interface IncomeReportFiltersProps {
  filters: FiltersType;
  onFilterChange: (newFilters: Partial<FiltersType>) => void;
}

export default function IncomeReportFilters({ filters, onFilterChange }: IncomeReportFiltersProps) {
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const statusOptions = [
    { label: "Semua Status", value: "" },
    { label: "Lunas", value: "fully_paid" },
    { label: "DP (Uang Muka)", value: "dp" },
    { label: "Belum Bayar", value: "unpaid" },
  ];

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
    <div className="grid grid-cols-1 gap-6 rounded-[24px] border border-platinum-tint bg-white p-6 shadow-card sm:grid-cols-2 lg:grid-cols-3">
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
            value={filters.start_date || ""}
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
            value={filters.end_date || ""}
            onChange={(e) => onFilterChange({ end_date: e.target.value })}
            className="absolute inset-0 h-full w-full pointer-events-none opacity-0"
          />
        </div>
      </div>

      {/* Status Pembayaran */}
      <div className="flex flex-col gap-2">
        <Select
          label="Status Pembayaran"
          icon={Filter}
          value={filters.status || ""}
          options={statusOptions}
          onChange={(value) => onFilterChange({ status: (value as any) || undefined })}
        />
      </div>
    </div>
  );
}
