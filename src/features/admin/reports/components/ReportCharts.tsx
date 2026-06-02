import { Card } from "@/components/ui/Card";
import type { BookingReportStatistics } from "../types/BookingReport";
import { cn } from "@/lib/utils";

interface ReportChartsProps {
  statistics: BookingReportStatistics;
}

export default function ReportCharts({ statistics }: ReportChartsProps) {
  const maxStatusCount = Math.max(...statistics.status_chart.map(s => s.count), 1);
  const maxActivityCount = Math.max(...statistics.activity_chart.map(a => a.count), 1);
  const maxMonthlyCount = Math.max(...statistics.monthly_chart.map(m => m.count), 1);

  return (
    <div className="flex flex-col gap-8">
      {/* Monthly Trend - Full Width */}
      <Card className="p-8 border-platinum-tint bg-white shadow-card">
        <div className="mb-10 border-l-4 border-action-blue pl-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-blue">Tren Bulanan</h3>
          <p className="text-xl font-bold text-midnight-indigo mt-1">Grafik Performa Pesanan</p>
        </div>
        <div className="flex h-56 items-end gap-3 px-2">
          {statistics.monthly_chart.map((month) => (
            <div key={month.month} className="group relative flex flex-1 flex-col items-center gap-3">
              <div 
                className="w-full rounded-t-xl bg-cloud-mist transition-all duration-500 group-hover:bg-action-blue group-hover:shadow-button"
                style={{ height: `${(month.count / maxMonthlyCount) * 100}%`, minHeight: '6px' }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-midnight-indigo px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-1 whitespace-nowrap z-10 shadow-lg">
                  {month.count} Pesanan
                </div>
              </div>
              <span className="text-[10px] font-semibold text-steel-gray uppercase tracking-widest">{month.month}</span>
            </div>
          ))}
          {statistics.monthly_chart.length === 0 && (
            <div className="flex w-full items-center justify-center text-sm font-medium text-slate-blue italic py-10">Data bulanan belum tersedia</div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Status Chart */}
        <Card className="p-8 border-platinum-tint bg-white shadow-card">
          <div className="mb-8 border-l-4 border-royal-amethyst pl-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-blue">Status</h3>
            <p className="text-lg font-bold text-midnight-indigo mt-1">Distribusi Status Pesanan</p>
          </div>
          <div className="flex flex-col gap-6">
            {statistics.status_chart.map((status) => (
              <div key={status.status} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-midnight-indigo capitalize">{status.status}</span>
                  <span className="text-slate-blue font-semibold opacity-60">{status.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-cloud-mist overflow-hidden">
                  <div 
                    className="h-full bg-royal-amethyst rounded-full transition-all duration-700"
                    style={{ width: `${(status.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Chart */}
        <Card className="p-8 border-platinum-tint bg-midnight-indigo text-white shadow-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="mb-8 border-l-4 border-emerald-400 pl-4">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">Aktivitas</h3>
              <p className="text-lg font-bold text-white mt-1">Distribusi Jenis Perjalanan</p>
            </div>
            <div className="flex flex-col gap-6">
              {statistics.activity_chart.map((activity) => (
                <div key={activity.activity_type_id} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-white/80">{activity.activity?.name || "Lainnya"}</span>
                    <span className="text-white font-bold">{activity.count}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                      style={{ width: `${(activity.count / maxActivityCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
