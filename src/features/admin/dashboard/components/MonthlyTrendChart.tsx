
import React from 'react';
import { Card } from '@/components/ui/Card';

interface MonthlyTrendChartProps {
  data: { month: string; count: number }[];
  loading?: boolean;
}

export default function MonthlyTrendChart({ data, loading }: MonthlyTrendChartProps) {
  const maxCount = Math.max(...data.map(m => m.count), 1);

  return (
    <Card className="p-6 border-slate-200/80 bg-white shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Grafik Pemesanan Bulanan</h3>
          <p className="text-xs text-slate-400">Tren pemesanan armada 6 bulan terakhir</p>
        </div>
      </div>

      <div className="flex h-40 items-end gap-2 px-1">
        {loading ? (
          <div className="flex w-full h-full items-center justify-center">
            <div className="h-8 w-full animate-pulse rounded-lg bg-slate-50" />
          </div>
        ) : (
          data.map((item, i) => (
            <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
              <div 
                className="w-full rounded-t-md bg-indigo-100 transition-all duration-300 group-hover:bg-indigo-600"
                style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: '4px' }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-10">
                  {item.count} Booking
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                {new Date(item.month).toLocaleDateString('id-ID', { month: 'short' })}
              </span>
            </div>
          ))
        )}
        {!loading && data.length === 0 && (
          <div className="flex w-full h-full items-center justify-center text-xs text-slate-400 italic">
            Belum ada data bulanan
          </div>
        )}
      </div>
    </Card>
  );
}
