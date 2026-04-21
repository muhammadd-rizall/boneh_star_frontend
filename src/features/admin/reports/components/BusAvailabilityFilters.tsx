import React from "react";
import Input from "@/components/ui/Input";
import { Calendar } from "lucide-react";
import type { BusAvailabilityReportFilters } from "../types/BusAvailabilityReport";

interface BusAvailabilityFiltersProps {
  filters: BusAvailabilityReportFilters;
  onFilterChange: (newFilters: Partial<BusAvailabilityReportFilters>) => void;
}

export default function BusAvailabilityFilters({ filters, onFilterChange }: BusAvailabilityFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-[28px] border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:grid-cols-2">
      <Input
        label="Start Date"
        type="date"
        icon={Calendar}
        value={filters.start_date}
        onChange={(e) => onFilterChange({ start_date: e.target.value })}
      />
      <Input
        label="End Date"
        type="date"
        icon={Calendar}
        value={filters.end_date}
        onChange={(e) => onFilterChange({ end_date: e.target.value })}
      />
    </div>
  );
}
