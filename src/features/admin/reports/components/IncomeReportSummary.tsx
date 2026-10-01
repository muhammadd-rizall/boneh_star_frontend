import { Wallet, Clock, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatter";
import type { IncomeReportSummary as SummaryType } from "../types/IncomeReport";
import { StatCard, StatGrid } from "@/components/ui/PageComponents";

interface IncomeReportSummaryProps {
  summary: SummaryType;
}

export default function IncomeReportSummary({ summary }: IncomeReportSummaryProps) {
  return (
    <StatGrid columns={3}>
      <StatCard
        label="Total Pendapatan Terverifikasi"
        value={formatCurrency(summary.total_verified_income)}
        note="Seluruh pembayaran terverifikasi"
        icon={TrendingUp}
        color="emerald"
      />
      <StatCard
        label="Total Piutang (Outstanding)"
        value={formatCurrency(summary.total_outstanding)}
        note="Piutang yang belum dilunasi"
        icon={Clock}
        color="amber"
      />
      <StatCard
        label="Total Potensi"
        value={formatCurrency(Number(summary.total_verified_income || 0) + Number(summary.total_outstanding || 0))}
        note="Akumulasi pendapatan & piutang"
        icon={Wallet}
        color="violet"
      />
    </StatGrid>
  );
}
