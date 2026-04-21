
import Card from "@/components/ui/Card";
import { Wallet, Clock, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/formatter";
import type { IncomeReportSummary as SummaryType } from "../types/IncomeReport";

interface IncomeReportSummaryProps {
  summary: SummaryType;
}

export default function IncomeReportSummary({ summary }: IncomeReportSummaryProps) {
  const items = [
    {
      label: "Total Verified Income",
      value: formatCurrency(summary.total_verified_income),
      detail: "All verified payments",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Total Outstanding",
      value: formatCurrency(summary.total_outstanding),
      detail: "Pending settlements",
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Potential Total",
      value: formatCurrency(summary.total_verified_income + summary.total_outstanding),
      detail: "Income + Outstanding",
      icon: Wallet,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
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
