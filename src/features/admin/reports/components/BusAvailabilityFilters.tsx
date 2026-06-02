import { Input } from "@/components/ui/Input";
import { Calendar } from "lucide-react";
import type { BusAvailabilityReportFilters } from "../types/BusAvailabilityReport";

interface BusAvailabilityFiltersProps {
  filters: BusAvailabilityReportFilters;
  onFilterChange: (newFilters: Partial<BusAvailabilityReportFilters>) => void;
}

export default function BusAvailabilityFilters({ filters, onFilterChange }: BusAvailabilityFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-6 rounded-[24px] border border-platinum-tint bg-white p-8 shadow-card sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
