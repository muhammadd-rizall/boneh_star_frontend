
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Calendar, Filter, Map } from "lucide-react";
import type { BookingReportFilters } from "../types/BookingReport";

interface ReportFiltersProps {
  filters: BookingReportFilters;
  onFilterChange: (newFilters: Partial<BookingReportFilters>) => void;
}

export default function ReportFilters({ filters, onFilterChange }: ReportFiltersProps) {
  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Quoted", value: "quoted" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Ongoing", value: "ongoing" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  const scopeOptions = [
    { label: "All Scopes", value: "" },
    { label: "Inside (Internal)", value: "internal" },
    { label: "Outside (External)", value: "external" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 rounded-[2.5rem] border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/50 sm:grid-cols-2 lg:grid-cols-4">
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
      <Select
        label="Booking Status"
        icon={Filter}
        value={filters.status || ""}
        options={statusOptions}
        onChange={(value) => onFilterChange({ status: value || undefined })}
        className="rounded-2xl"
      />
      <Select
        label="Trip Scope"
        icon={Map}
        value={filters.scope || ""}
        options={scopeOptions}
        onChange={(value) => onFilterChange({ scope: (value as any) || undefined })}
        className="rounded-2xl"
      />
    </div>
  );
}
