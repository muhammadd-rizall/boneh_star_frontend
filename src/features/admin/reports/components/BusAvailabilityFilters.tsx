
import Input from "@/components/ui/Input";
import { Calendar } from "lucide-react";
import type { BusAvailabilityReportFilters } from "../types/BusAvailabilityReport";

interface BusAvailabilityFiltersProps {
  filters: BusAvailabilityReportFilters;
  onFilterChange: (newFilters: Partial<BusAvailabilityReportFilters>) => void;
}

export default function BusAvailabilityFilters({ filters, onFilterChange }: BusAvailabilityFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-[2.5rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/50 sm:grid-cols-2 lg:grid-cols-3">
      <Input
        label="Start Date"
        type="date"
        icon={Calendar}
        value={filters.start_date}
        onChange={(e) => onFilterChange({ start_date: e.target.value })}
        className="rounded-2xl"
      />
      <Input
        label="End Date"
        type="date"
        icon={Calendar}
        value={filters.end_date}
        onChange={(e) => onFilterChange({ end_date: e.target.value })}
        className="rounded-2xl"
      />
    </div>
  );
}
