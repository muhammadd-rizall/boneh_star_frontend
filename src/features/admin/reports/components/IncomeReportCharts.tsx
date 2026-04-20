import React from "react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatter";
import type { IncomeReportStatistics } from "../types/IncomeReport";

interface IncomeReportChartsProps {
  statistics: IncomeReportStatistics;
}

export default function IncomeReportCharts({ statistics }: IncomeReportChartsProps) {
  const maxMonthlyIncome = Math.max(
    ...statistics.monthly_chart.map(m => Number(m.total_masuk)), 
    1
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Monthly Trend - Full Width */}
      <Card className="p-6 border-slate-200/80 bg-white/90 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-8">Monthly Income Trend</h3>
        <div className="flex h-64 items-end gap-3 px-2">
          {statistics.monthly_chart.map((month) => (
            <div key={month.month} className="group relative flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-end gap-1">
                 <div 
                  className="flex-1 rounded-t-sm bg-blue-400/70 transition-all duration-300 group-hover:bg-blue-500"
                  style={{ height: `${(Number(month.total_dp) / maxMonthlyIncome) * 100}%`, minHeight: Number(month.total_dp) > 0 ? '4px' : '0' }}
                />
                <div 
                  className="flex-1 rounded-t-sm bg-emerald-400/70 transition-all duration-300 group-hover:bg-emerald-500"
                  style={{ height: `${(Number(month.total_pelunasan) / maxMonthlyIncome) * 100}%`, minHeight: Number(month.total_pelunasan) > 0 ? '4px' : '0' }}
                />
              </div>
              
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-3 py-2 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 z-10 whitespace-nowrap pointer-events-none">
                <p className="text-blue-300">DP: {formatCurrency(month.total_dp)}</p>
                <p className="text-emerald-300">Set: {formatCurrency(month.total_pelunasan)}</p>
                <div className="mt-1 border-t border-slate-600 pt-1">
                  Total: {formatCurrency(month.total_masuk)}
                </div>
              </div>
              
              <span className="text-[10px] font-medium text-slate-400">{month.month}</span>
            </div>
          ))}
          {statistics.monthly_chart.length === 0 && (
            <div className="flex w-full items-center justify-center text-sm text-slate-400">No monthly data available</div>
          )}
        </div>
        
        <div className="mt-6 flex justify-center gap-6 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-blue-400" />
            <span className="text-xs font-medium text-slate-500">Down Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-sm bg-emerald-400" />
            <span className="text-xs font-medium text-slate-500">Settlement</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
