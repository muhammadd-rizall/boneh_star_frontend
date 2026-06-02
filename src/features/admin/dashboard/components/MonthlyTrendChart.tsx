import { Card } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';

interface MonthlyTrendChartProps {
  data: { month: string; count: number }[];
  loading?: boolean;
}

export default function MonthlyTrendChart({ data, loading }: MonthlyTrendChartProps) {
  const maxCount = Math.max(...data.map(m => m.count), 1);

  return (
    <Card className="border-platinum-tint bg-white p-6 shadow-sm sm:p-8 rounded-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cloud-mist text-action-blue shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Grafik Pemesanan Bulanan</h3>
            <p className="text-sm font-medium text-slate-blue opacity-70">Tren pemesanan armada 6 bulan terakhir</p>
          </div>
        </div>
      </div>

      <div className="flex h-60 items-stretch gap-3 px-1 sm:h-72 sm:gap-4">
        {loading ? (
          <div className="flex w-full h-full items-end gap-3">
             {[1, 2, 3, 4, 5, 6].map(i => (
               <div key={i} className="flex-1 h-full animate-pulse rounded-t-2xl bg-cloud-mist" />
             ))}
          </div>
        ) : (
          data.map((item, i) => (
            <div key={`${item.month}-${i}`} className="group relative flex min-w-0 flex-1 flex-col items-center gap-4">
              <div className="relative flex w-full flex-1 items-end rounded-t-2xl bg-cloud-mist/40 transition-colors group-hover:bg-cloud-mist/60 overflow-hidden">
                <div
                  className="w-full rounded-t-2xl bg-action-blue/20 transition-all duration-700 ease-out group-hover:bg-action-blue group-hover:shadow-[0_0_20px_rgba(0,107,255,0.4)]"
                  style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: '8px' }}
                />
                
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-white/20 bg-midnight-indigo/95 backdrop-blur-sm px-4 py-2 text-[12px] font-bold whitespace-nowrap text-white opacity-0 shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:opacity-100 flex flex-col items-center">
                  <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider mb-0.5">
                    {new Date(item.month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </span>
                  <span>{item.count} Pemesanan</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold text-midnight-indigo uppercase tracking-wider">
                  {new Date(item.month).toLocaleDateString('id-ID', { month: 'short' })}
                </span>
                <span className="text-[10px] font-medium text-steel-gray">
                  {new Date(item.month).getFullYear()}
                </span>
              </div>
            </div>
          ))
        )}
        {!loading && data.length === 0 && (
          <div className="flex w-full h-full items-center justify-center text-sm font-medium text-slate-blue italic">
            Belum ada data bulanan
          </div>
        )}
      </div>
    </Card>
  );
}
