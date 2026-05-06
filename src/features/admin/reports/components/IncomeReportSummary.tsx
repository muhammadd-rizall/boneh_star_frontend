
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
        label="Total Verified Income"
        value={formatCurrency(summary.total_verified_income)}
        note="Seluruh pembayaran terverifikasi"
        icon={TrendingUp}
        color="emerald"
      />
      <StatCard
        label="Total Outstanding"
        value={formatCurrency(summary.total_outstanding)}
        note="Piutang yang belum dilunasi"
        icon={Clock}
        color="amber"
      />
      <StatCard
        label="Potential Total"
        value={formatCurrency(summary.total_verified_income + summary.total_outstanding)}
        note="Akumulasi pendapatan & piutang"
        icon={Wallet}
        color="violet"
      />
    </StatGrid>
  );
}
