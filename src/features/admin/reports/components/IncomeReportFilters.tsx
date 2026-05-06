
import Select from "@/components/ui/Select";
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
    { label: "All Months", value: "" },
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Fully Paid", value: "fully_paid" },
    { label: "Down Payment", value: "dp" },
    { label: "Unpaid", value: "unpaid" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 rounded-[2.5rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/50 sm:grid-cols-2 lg:grid-cols-3">
      <Select
        label="Report Year"
        icon={Calendar}
        value={filters.year}
        options={years}
        onChange={(value) => onFilterChange({ year: value })}
        className="rounded-2xl"
      />
      <Select
        label="Report Month"
        icon={Calendar}
        value={filters.month || ""}
        options={months}
        onChange={(value) => onFilterChange({ month: value || undefined })}
        className="rounded-2xl"
      />
      <Select
        label="Payment Status"
        icon={Filter}
        value={filters.status || ""}
        options={statusOptions}
        onChange={(value) => onFilterChange({ status: (value as any) || undefined })}
        className="rounded-2xl"
      />
    </div>
  );
}
