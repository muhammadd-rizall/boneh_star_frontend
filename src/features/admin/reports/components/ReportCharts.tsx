
import Card from "@/components/ui/Card";
import type { BookingReportStatistics } from "../types/BookingReport";

interface ReportChartsProps {
  statistics: BookingReportStatistics;
}

export default function ReportCharts({ statistics }: ReportChartsProps) {
  const maxStatusCount = Math.max(...statistics.status_chart.map(s => s.count), 1);
  const maxActivityCount = Math.max(...statistics.activity_chart.map(a => a.count), 1);
  const maxMonthlyCount = Math.max(...statistics.monthly_chart.map(m => m.count), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Monthly Trend - Full Width */}
      <Card className="p-6 border-slate-200/80 bg-white/90 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-8">Monthly Booking Trend</h3>
        <div className="flex h-48 items-end gap-3 px-2">
          {statistics.monthly_chart.map((month) => (
            <div key={month.month} className="group relative flex flex-1 flex-col items-center gap-2">
              <div 
                className="w-full rounded-t-lg bg-indigo-100 transition-all duration-300 group-hover:bg-indigo-500"
                style={{ height: `${(month.count / maxMonthlyCount) * 100}%`, minHeight: '4px' }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {month.count}
                </div>
              </div>
              <span className="text-[10px] font-medium text-slate-400">{month.month}</span>
            </div>
          ))}
          {statistics.monthly_chart.length === 0 && (
            <div className="flex w-full items-center justify-center text-sm text-slate-400">No monthly data available</div>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Chart */}
        <Card className="p-6 border-slate-200/80 bg-white/90 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">Status Distribution</h3>
          <div className="flex flex-col gap-4">
            {statistics.status_chart.map((status) => (
              <div key={status.status} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 capitalize">{status.status}</span>
                  <span className="text-slate-500 font-semibold">{status.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${(status.count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Chart */}
        <Card className="p-6 border-slate-200/80 bg-slate-900 text-white shadow-lg">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">Activity Distribution</h3>
          <div className="flex flex-col gap-4">
            {statistics.activity_chart.map((activity) => (
              <div key={activity.activity_type_id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-300">{activity.activity?.name || "Unknown"}</span>
                  <span className="text-white font-semibold">{activity.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                    style={{ width: `${(activity.count / maxActivityCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
