import { Input } from "@/components/ui/Input";
import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Calendar, Filter, Map } from "lucide-react";
import type { BookingReportFilters } from "../types/BookingReport";

interface ReportFiltersProps {
  filters: BookingReportFilters;
  onFilterChange: (newFilters: Partial<BookingReportFilters>) => void;
}

export default function ReportFilters({ filters, onFilterChange }: ReportFiltersProps) {
  const statusOptions = [
    { label: "Semua Status", value: "" },
    { label: "Tertunda (Pending)", value: "pending" },
    { label: "Ditawarkan", value: "quoted" },
    { label: "Dikonfirmasi", value: "confirmed" },
    { label: "Dalam Perjalanan", value: "ongoing" },
    { label: "Selesai", value: "completed" },
    { label: "Dibatalkan", value: "cancelled" },
  ];

  const scopeOptions = [
    { label: "Semua Cakupan", value: "" },
    { label: "Dalam Kota", value: "internal" },
    { label: "Luar Kota", value: "external" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 rounded-[24px] border border-platinum-tint bg-white p-8 shadow-card sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Tanggal Mulai"
        type="date"
        icon={Calendar}
        value={filters.start_date}
        onChange={(e) => onFilterChange({ start_date: e.target.value })}
      />
      <Input
        label="Tanggal Selesai"
        type="date"
        icon={Calendar}
        value={filters.end_date}
        onChange={(e) => onFilterChange({ end_date: e.target.value })}
      />
      <Select
        label="Status Pesanan"
        icon={Filter}
        value={filters.status || ""}
        options={statusOptions}
        onChange={(value) => onFilterChange({ status: value || undefined })}
      />
      <Select
        label="Cakupan Rute"
        icon={Map}
        value={filters.scope || ""}
        options={scopeOptions}
        onChange={(value) => onFilterChange({ scope: (value as any) || undefined })}
      />
    </div>
  );
}
