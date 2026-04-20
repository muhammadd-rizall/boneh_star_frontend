import React from "react";
import Card from "@/components/ui/Card";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import type { BookingReportSummary } from "../types/BookingReport";

interface ReportSummaryProps {
  summary: BookingReportSummary;
}

export default function ReportSummary({ summary }: ReportSummaryProps) {
  const items = [
    {
      label: "Total Bookings",
      value: summary.total_bookings,
      detail: "Bookings in period",
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Total Passengers",
      value: summary.total_passengers.toLocaleString(),
      detail: "Accumulated count",
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Avg Passengers",
      value: summary.avg_passengers,
      detail: "Per booking average",
      icon: BarChart3,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {items.map((item, i) => (
        <Card key={i} className="flex items-center gap-5 p-6 border-slate-200/80 bg-white/90 shadow-sm">
          <div className={`flex h-14 w-14 items-center justify-center rounded-[20px] ${item.bg} ${item.color}`}>
            <item.icon size={28} />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-slate-500">{item.label}</p>
            <p className="text-2xl font-bold tracking-tight text-slate-900">{item.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{item.detail}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
