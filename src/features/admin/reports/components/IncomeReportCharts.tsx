import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatter";
import type { IncomeReportStatistics } from "../types/IncomeReport";
import { cn } from "@/lib/utils";

interface IncomeReportChartsProps {
  statistics: IncomeReportStatistics;
}

export default function IncomeReportCharts({ statistics }: IncomeReportChartsProps) {
  const maxMonthlyIncome = Math.max(
    ...statistics.monthly_chart.map(m => Number(m.total_masuk)), 
    1
  );

  const yAxisSteps = Array.from({ length: 4 }, (_, i) => Math.round((maxMonthlyIncome / 3) * (3 - i)));

  const formatYAxis = (value: number) => {
    if (value >= 1_000_000) {
      return `Rp ${(value / 1_000_000).toFixed(1).replace('.0', '')}jt`;
    }
    if (value >= 1_000) {
      return `Rp ${(value / 1_000).toFixed(0)}rb`;
    }
    return `Rp ${value}`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Monthly Trend - Full Width */}
      <Card className="px-6 pt-6 pb-5 border-slate-200/80 bg-white/90 shadow-card rounded-2xl">
        <div className="mb-8 border-l-4 border-emerald-500 pl-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Monthly Income Trend</h3>
          <p className="text-xl font-bold text-midnight-indigo mt-1">Grafik Performa Pendapatan</p>
        </div>

        <div className="relative flex flex-col pt-4">
          <div className="flex h-64 items-stretch gap-4 sm:h-72">
            {/* Y-axis Labels */}
            <div className="flex flex-col justify-between text-[11px] font-bold text-slate-blue/60 w-16 pr-2 select-none">
              {yAxisSteps.map((val, idx) => (
                <span key={idx} className="text-right leading-none">{formatYAxis(val)}</span>
              ))}
            </div>

            {/* Grid & Bars Container */}
            <div className="relative flex-1 flex items-end justify-between gap-3 sm:gap-4 h-full">
              {/* Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-full border-t", 
                      i === 3 ? "border-slate-200" : "border-slate-200/50 border-dashed"
                    )} 
                  />
                ))}
              </div>

              {/* Bars */}
              {statistics.monthly_chart.map((month) => (
                <div key={month.month} className="group relative flex-1 flex flex-col items-center h-full justify-end z-10">
                  <div className="relative w-full flex items-end justify-center gap-1.5 h-full rounded-t-xl hover:bg-slate-50/50 transition-all duration-300 cursor-pointer px-1 py-1">
                    {/* DP Bar */}
                    <div 
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-500/80 to-blue-400 transition-all duration-500 ease-out group-hover:from-blue-600 group-hover:to-blue-500 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                      style={{ height: `${(Number(month.total_dp) / maxMonthlyIncome) * 100}%`, minHeight: Number(month.total_dp) > 0 ? '6px' : '0' }}
                    />
                    {/* Settlement Bar */}
                    <div 
                      className="flex-1 rounded-t-lg bg-gradient-to-t from-emerald-500/80 to-emerald-400 transition-all duration-500 ease-out group-hover:from-emerald-600 group-hover:to-emerald-500 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                      style={{ height: `${(Number(month.total_pelunasan) / maxMonthlyIncome) * 100}%`, minHeight: Number(month.total_pelunasan) > 0 ? '6px' : '0' }}
                    />

                    {/* Premium Tooltip */}
                    <div className="absolute bottom-full left-1/2 z-30 -translate-x-1/2 mb-2 rounded-xl border border-slate-200 bg-midnight-indigo/95 backdrop-blur-sm px-4 py-3 text-[11px] font-bold text-white opacity-0 shadow-xl transition-all duration-300 pointer-events-none group-hover:opacity-100 group-hover:translate-y-[-4px] whitespace-nowrap flex flex-col gap-1.5">
                      <div className="text-[10px] text-white/50 font-medium uppercase tracking-wider border-b border-white/10 pb-1 mb-0.5">
                        {month.month}
                      </div>
                      <div className="flex items-center gap-2 justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-white/70">
                          <span className="h-2 w-2 rounded-full bg-blue-400" /> DP
                        </span>
                        <span className="text-blue-300">{formatCurrency(month.total_dp)}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-between">
                        <span className="flex items-center gap-1.5 font-medium text-white/70">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Pelunasan
                        </span>
                        <span className="text-emerald-300">{formatCurrency(month.total_pelunasan)}</span>
                      </div>
                      <div className="border-t border-white/15 pt-1.5 mt-1 flex items-center justify-between text-xs font-extrabold text-white">
                        <span>Total Masuk</span>
                        <span className="text-sunset-gold">{formatCurrency(month.total_masuk)}</span>
                      </div>
                      {/* Arrow tail */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-midnight-indigo/95" />
                    </div>
                  </div>
                </div>
              ))}
              {statistics.monthly_chart.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-blue italic z-10">
                  Data bulanan belum tersedia
                </div>
              )}
            </div>
          </div>

          {/* X-axis Labels */}
          {statistics.monthly_chart.length > 0 && (
            <div className="flex pl-20 mt-4 select-none">
              {statistics.monthly_chart.map((month) => (
                <div key={month.month} className="flex-1 flex justify-center">
                  <span className="text-[10px] font-bold text-midnight-indigo uppercase tracking-widest truncate text-center">
                    {month.month}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Legend */}
        <div className="mt-8 flex justify-center gap-6 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/50 border border-blue-100/35">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
            <span className="text-xs font-bold text-slate-600">Uang Muka (DP)</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/50 border border-emerald-100/35">
            <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <span className="text-xs font-bold text-slate-600">Pelunasan (Settlement)</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
