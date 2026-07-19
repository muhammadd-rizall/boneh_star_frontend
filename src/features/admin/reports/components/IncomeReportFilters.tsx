import { CustomSelect as Select } from "@/components/ui/CustomSelect";
import { Calendar, Filter } from "lucide-react";
import type { IncomeReportFilters as FiltersType } from "../types/IncomeReport";

interface IncomeReportFiltersProps {
  filters: FiltersType;
  onFilterChange: (newFilters: Partial<FiltersType>) => void;
}

export default function IncomeReportFilters({ filters, onFilterChange }: IncomeReportFiltersProps) {
  const years = Array.from({ length: 5 }, (_, i) => ({
    label: (new Date().getFullYear() - i).toString(),
    value: (new Date().getFullYear() - i).toString(),
  }));

  const months = [
    { label: "Semua Bulan", value: "" },
    { label: "Januari", value: "1" },
    { label: "Februari", value: "2" },
    { label: "Maret", value: "3" },
    { label: "April", value: "4" },
    { label: "Mei", value: "5" },
    { label: "Juni", value: "6" },
    { label: "Juli", value: "7" },
    { label: "Agustus", value: "8" },
    { label: "September", value: "9" },
    { label: "Oktober", value: "10" },
    { label: "November", value: "11" },
    { label: "Desember", value: "12" },
  ];

  const statusOptions = [
    { label: "Semua Status", value: "" },
    { label: "Lunas", value: "fully_paid" },
    { label: "DP (Uang Muka)", value: "dp" },
    { label: "Belum Bayar", value: "unpaid" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 rounded-[24px] border border-platinum-tint bg-white p-8 shadow-card sm:grid-cols-2 lg:grid-cols-3">
      <Select
        label="Tahun Laporan"
        icon={Calendar}
        value={filters.year?.toString() || ""}
        options={years}
        onChange={(value) => onFilterChange({ year: value ? parseInt(value, 10) : undefined })}
      />
      <Select
        label="Bulan Laporan"
        icon={Calendar}
        value={filters.month?.toString() || ""}
        options={months}
        onChange={(value) => onFilterChange({ month: value ? parseInt(value, 10) : undefined })}
      />
      <Select
        label="Status Pembayaran"
        icon={Filter}
        value={filters.status || ""}
        options={statusOptions}
        onChange={(value) => onFilterChange({ status: (value as any) || undefined })}
      />
    </div>
  );
}
