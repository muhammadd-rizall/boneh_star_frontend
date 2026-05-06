
import { BookOpen, Users, BarChart3 } from "lucide-react";
import type { BookingReportSummary } from "../types/BookingReport";
import { StatCard, StatGrid } from "@/components/ui/PageComponents";

interface ReportSummaryProps {
  summary: BookingReportSummary;
}

export default function ReportSummary({ summary }: ReportSummaryProps) {
  return (
    <StatGrid columns={3}>
      <StatCard
        label="Total Bookings"
        value={summary.total_bookings}
        note="Total pemesanan dalam periode"
        icon={BookOpen}
        color="violet"
      />
      <StatCard
        label="Total Passengers"
        value={summary.total_passengers.toLocaleString()}
        note="Akumulasi seluruh penumpang"
        icon={Users}
        color="emerald"
      />
      <StatCard
        label="Avg Passengers"
        value={summary.avg_passengers}
        note="Rata-rata per pemesanan"
        icon={BarChart3}
        color="amber"
      />
    </StatGrid>
  );
}
