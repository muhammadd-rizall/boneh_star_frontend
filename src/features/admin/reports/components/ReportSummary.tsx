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
        label="Total Pemesanan"
        value={summary.total_bookings}
        note="Total seluruh pesanan dalam periode"
        icon={BookOpen}
        color="violet"
      />
      <StatCard
        label="Total Penumpang"
        value={summary.total_passengers.toLocaleString()}
        note="Akumulasi jumlah penumpang"
        icon={Users}
        color="emerald"
      />
      <StatCard
        label="Rata-rata Penumpang"
        value={summary.avg_passengers}
        note="Rata-rata per satu pemesanan"
        icon={BarChart3}
        color="amber"
      />
    </StatGrid>
  );
}
