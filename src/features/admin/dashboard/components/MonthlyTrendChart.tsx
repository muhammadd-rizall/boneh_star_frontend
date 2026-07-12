import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MonthlyTrendChartProps {
  data: { month: string; count: number }[];
  loading?: boolean;
}

export default function MonthlyTrendChart({ data, loading }: MonthlyTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Pad data to ensure we always display the last 6 months
  const paddedData = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - idx));
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    const existing = data.find(item => {
      const existingDate = new Date(item.month);
      return existingDate.getFullYear() === d.getFullYear() && existingDate.getMonth() === d.getMonth();
    });
    
    return {
      month: yearMonth,
      count: existing ? existing.count : 0,
      label: d.toLocaleDateString('id-ID', { month: 'short' }),
      fullLabel: d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    };
  });

  const maxCount = Math.max(...paddedData.map(m => m.count), 1);
  const totalCount = data.reduce((acc, m) => acc + m.count, 0);
  const averageCount = data.length > 0 ? (totalCount / data.length).toFixed(1) : '0';

  // Map 6 points to SVG coordinates (Viewbox: 0 0 500 210)
  const points = paddedData.map((item, idx) => {
    const x = 40 + (idx * 88); // 40, 128, 216, 304, 392, 480
    const y = 170 - (item.count / maxCount) * 140; // max value at y=30, 0 at y=170
    return { x, y, ...item };
  });

  // Straight line path generator
  const linePath = points.length > 0 
    ? `M ${points.map(pt => `${pt.x} ${pt.y}`).join(' L ')}` 
    : '';

  // Subtle area fill path
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} 170 L ${points[0].x} 170 Z`
    : '';

  // Generate Y-axis steps
  const yAxisSteps = Array.from({ length: 4 }, (_, i) => Math.round((maxCount / 3) * (3 - i)));
  const yAxisPositions = [30, 76.6, 123.3, 170];

  return (
    <Card className="border-platinum-tint bg-white p-6 shadow-card sm:p-8 rounded-2xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-action-blue/10 text-action-blue shadow-sm">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-midnight-indigo tracking-tight">Grafik Pemesanan Bulanan</h3>
            <p className="text-sm font-medium text-slate-blue opacity-70">Tren pemesanan armada 6 bulan terakhir</p>
          </div>
        </div>

        {/* Quick summary stats */}
        {!loading && data.length > 0 && (
          <div className="flex items-center gap-6 rounded-2xl bg-cloud-mist/40 px-4 py-2 border border-platinum-tint/40 self-start sm:self-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-blue/70 uppercase tracking-wider">Total</span>
              <span className="text-sm font-extrabold text-midnight-indigo">{totalCount} Pesanan</span>
            </div>
            <div className="h-4 w-px bg-platinum-tint" />
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-blue/70 uppercase tracking-wider">Rerata</span>
              <span className="text-sm font-extrabold text-action-blue">{averageCount}/bln</span>
            </div>
          </div>
        )}
      </div>

      {/* Chart container */}
      <div className="relative w-full">
        {loading ? (
          <div className="flex h-64 w-full items-end justify-between gap-4 px-8 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 max-w-[48px] h-full flex flex-col justify-end items-center">
                <div 
                  className="w-full rounded-t-xl bg-cloud-mist/50 animate-pulse" 
                  style={{ height: `${20 + i * 12}%` }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative w-full">
            <svg 
              viewBox="0 0 500 210" 
              className="w-full h-full overflow-visible"
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.00" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="50%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
              </defs>

              {/* Gridlines & Y-Axis Labels */}
              {yAxisPositions.map((yVal, i) => (
                <g key={i} className="select-none">
                  {/* Gridline */}
                  <line
                    x1={40}
                    y1={yVal}
                    x2={480}
                    y2={yVal}
                    stroke={i === 3 ? "#E2E8F0" : "#F1F5F9"}
                    strokeWidth={1}
                    strokeDasharray={i === 3 ? "" : "3 3"}
                  />
                  {/* Y-Axis Label */}
                  <text
                    x={30}
                    y={yVal + 3.5}
                    textAnchor="end"
                    className="text-[10px] font-bold fill-slate-blue/60 font-sans"
                  >
                    {yAxisSteps[i]}
                  </text>
                </g>
              ))}

              {/* Area Under Curve */}
              {points.length > 0 && (
                <path
                  d={areaPath}
                  fill="url(#areaGrad)"
                  className="transition-all duration-300"
                />
              )}

              {/* Straight Segment Line */}
              {points.length > 0 && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-300"
                />
              )}

              {/* X-axis Labels */}
              {points.map((pt, idx) => (
                <g key={idx} className="select-none">
                  <text
                    x={pt.x}
                    y={192}
                    textAnchor="middle"
                    className={cn(
                      "text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 font-sans",
                      hoveredIdx === idx ? "fill-action-blue font-black" : "fill-midnight-indigo"
                    )}
                  >
                    {pt.label}
                  </text>
                  <text
                    x={pt.x}
                    y={204}
                    textAnchor="middle"
                    className={cn(
                      "text-[8px] font-semibold transition-all duration-200 font-sans",
                      hoveredIdx === idx ? "fill-action-blue/70" : "fill-steel-gray"
                    )}
                  >
                    {new Date(pt.month).getFullYear()}
                  </text>
                </g>
              ))}

              {/* Vertical Guide Line */}
              {hoveredIdx !== null && points[hoveredIdx] && (
                <line
                  x1={points[hoveredIdx].x}
                  y1={30}
                  x2={points[hoveredIdx].x}
                  y2={170}
                  stroke="#3B82F6"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  className="pointer-events-none"
                />
              )}

              {/* Dots */}
              {points.map((pt, idx) => (
                <g key={idx} className="pointer-events-none">
                  {/* Pulsing dot background on hover */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredIdx === idx ? 8 : 4}
                    fill="#3B82F6"
                    className="transition-all duration-200"
                    opacity={hoveredIdx === idx ? 0.25 : 0}
                  />
                  {/* Center dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredIdx === idx ? 4 : 3}
                    fill={hoveredIdx === idx ? "#ffffff" : "#3B82F6"}
                    stroke="#3B82F6"
                    strokeWidth={hoveredIdx === idx ? 3 : 2}
                    className="transition-all duration-200"
                  />
                </g>
              ))}

              {/* Hover catcher zones */}
              {points.map((pt, idx) => (
                <rect
                  key={idx}
                  x={pt.x - 44}
                  y={0}
                  width={88}
                  height={210}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              ))}
            </svg>

            {/* Floating Tooltip */}
            {hoveredIdx !== null && points[hoveredIdx] && (
              <div 
                className="absolute z-30 rounded-xl border border-platinum-tint bg-midnight-indigo/95 backdrop-blur-sm px-4 py-2.5 text-[12px] font-bold text-white shadow-xl pointer-events-none transition-all duration-150 flex flex-col items-center"
                style={{ 
                  left: `${(points[hoveredIdx].x / 500) * 100}%`,
                  bottom: `${100 - ((points[hoveredIdx].y / 210) * 100) + 4}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <span className="text-[10px] text-white/60 font-medium uppercase tracking-wider mb-0.5">
                  {points[hoveredIdx].fullLabel}
                </span>
                <span className="text-sm font-extrabold">{points[hoveredIdx].count} Pemesanan</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-midnight-indigo/95" />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
