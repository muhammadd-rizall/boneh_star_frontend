
import Select from "@/components/ui/Select";
import { Calendar, Filter } from "lucide-react";
import type { IncomeReportFilters as FiltersType } from "../types/IncomeReport";

interface IncomeReportFiltersProps {
  filters: FiltersType;
  onFilterChange: (newFilters: Partial<FiltersType>) => void;
}

export default function IncomeReportFilters({ filters, onFilterChange }: IncomeReportFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => ({
    label: (2020 + i).toString(),
    value: (2020 + i).toString(),
  })).reverse();

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

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-sm">
      <div className="w-full sm:w-48">
        <Select
          label="Select Year"
          icon={Calendar}
          value={filters.year?.toString() || ""}
          options={years}
          onChange={(value) => onFilterChange({ year: value ? parseInt(value) : undefined })}
        />
      </div>
      <div className="w-full sm:w-48">
        <Select
          label="Select Month"
          icon={Filter}
          value={filters.month?.toString() || ""}
          options={months}
          onChange={(value) => onFilterChange({ month: value ? parseInt(value) : undefined })}
        />
      </div>
    </div>
  );
}
