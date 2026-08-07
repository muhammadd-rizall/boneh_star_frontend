import { useState } from 'react';
import { Card } from "@/components/ui/Card";
import type { BookingReportStatistics } from "../types/BookingReport";
import { cn } from "@/lib/utils";
import { PieChart, Route } from "lucide-react";

interface ReportChartsProps {
  statistics: BookingReportStatistics;
}

export default function ReportCharts({ statistics }: ReportChartsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const maxActivityCount = Math.max(...statistics.activity_chart.map(a => a.count), 1);
  const activityTotal = statistics.activity_chart.reduce((sum, item) => sum + item.count, 0);

  // Pad data to ensure we always display the last 6 months for the trend chart
  const paddedData = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - idx));
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    // Find matching month in statistics
    const existing = statistics.monthly_chart.find(item => {
      // Handle date formats like "2026-07" or full month names
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

  const maxMonthlyCount = Math.max(...paddedData.map(m => m.count), 1);

  // Map 6 points to SVG coordinates (Viewbox: 0 0 500 210)
  const points = paddedData.map((item, idx) => {
    const x = 40 + (idx * 88); // 40, 128, 216, 304, 392, 480
    const y = 170 - (item.count / maxMonthlyCount) * 140; // max value at y=30, 0 at y=170
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
  const yAxisSteps = Array.from({ length: 4 }, (_, i) => Math.round((maxMonthlyCount / 3) * (3 - i)));
  const yAxisPositions = [30, 76.6, 123.3, 170];


  // Donut Chart logic for "Distribusi Status Pesanan"
  const statusTotal = statistics.status_chart.reduce((sum, item) => sum + item.count, 0);
  
  // Status Colors (Fresh palette without midnight and purple)
  const statusColors: Record<string, string> = {
    pending: '#F59E0B', // Amber
    confirmed: '#3B82F6', // Blue
    completed: '#10B981', // Emerald
    cancelled: '#EF4444', // Red
    quoted: '#0EA5E9', // Sky
    negotiation: '#0D9488', // Teal
  };

  const statusTextClasses: Record<string, string> = {
    pending: 'text-amber-500 bg-amber-500/10',
    confirmed: 'text-blue-500 bg-blue-50/70',
    completed: 'text-emerald-500 bg-emerald-50/70',
    cancelled: 'text-rose-500 bg-rose-50/70',
    quoted: 'text-sky-500 bg-sky-50/70',
    negotiation: 'text-teal-500 bg-teal-50/70',
  };

  const accumulatedPercents: number[] = [];
  let sum = 0;
  for (const item of statistics.status_chart) {
    accumulatedPercents.push(sum);
    const percent = statusTotal > 0 ? item.count / statusTotal : 0;
    sum += percent;
  }

  const donutSlices = statistics.status_chart.map((item, idx) => {
    const percent = statusTotal > 0 ? item.count / statusTotal : 0;
    const strokeLength = percent * 314.159;
    const strokeOffset = -accumulatedPercents[idx] * 314.159;

    return {
      ...item,
      percent,
      strokeLength,
      strokeOffset,
      color: statusColors[item.status.toLowerCase()] || '#94A3B8',
      badgeClass: statusTextClasses[item.status.toLowerCase()] || 'text-slate-500 bg-slate-50',
    };
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Monthly Trend - Full Width Line Chart */}
      <Card className="px-6 pt-6 pb-5 border-platinum-tint bg-white shadow-card rounded-2xl">
        <div className="mb-8 border-l-4 border-action-blue pl-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-blue">Tren Bulanan</h3>
          <p className="text-xl font-bold text-midnight-indigo mt-1">Grafik Performa Pesanan</p>
        </div>

        <div className="relative w-full">
          <svg 
            viewBox="0 0 500 210" 
            className="w-full h-full overflow-visible"
          >
            {/* Gradients */}
            <defs>
              <linearGradient id="areaGradReport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.00" />
              </linearGradient>
              <linearGradient id="lineGradReport" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#0EA5E9" />
              </linearGradient>
            </defs>

            {/* Gridlines & Y-Axis Labels */}
            {yAxisPositions.map((yVal, i) => (
              <g key={i} className="select-none">
                <line
                  x1={40}
                  y1={yVal}
                  x2={480}
                  y2={yVal}
                  stroke={i === 3 ? "#E2E8F0" : "#F1F5F9"}
                  strokeWidth={1}
                  strokeDasharray={i === 3 ? "" : "3 3"}
                />
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
                fill="url(#areaGradReport)"
                className="transition-all duration-300"
              />
            )}

            {/* Straight Segment Line */}
            {points.length > 0 && (
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineGradReport)"
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
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredIdx === idx ? 8 : 4}
                  fill="#3B82F6"
                  className="transition-all duration-200"
                  opacity={hoveredIdx === idx ? 0.25 : 0}
                />
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
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Status Chart - Replaced with Donut (Pie) Chart */}
        <Card className="px-6 pt-6 pb-5 border-platinum-tint bg-white shadow-card rounded-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-blue">Status</h3>
              <p className="text-lg font-bold text-midnight-indigo mt-1">Distribusi Status Pesanan</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500"><PieChart size={20} /></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 items-center">
            {/* SVG Donut Chart */}
            <div className="relative h-[160px] w-[160px] mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="transparent"
                  stroke="#F8FAFC"
                  strokeWidth="16"
                />
                {donutSlices.map((slice, idx) => (
                  <circle
                    key={slice.status}
                    cx="100"
                    cy="100"
                    r="50"
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={hoveredSlice === idx ? "22" : "16"}
                    strokeDasharray={`${slice.strokeLength} 314.159`}
                    strokeDashoffset={slice.strokeOffset}
                    className="transition-all duration-300 cursor-pointer"
                    onMouseEnter={() => setHoveredSlice(idx)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  />
                ))}
              </svg>
              
              {/* Central Text inside Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                {hoveredSlice === null ? (
                  <>
                    <span className="text-2xl font-black text-midnight-indigo font-sans leading-none">{statusTotal}</span>
                    <span className="text-[9px] font-bold text-slate-blue/60 uppercase tracking-widest mt-1">Total</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-black text-midnight-indigo font-sans leading-none">
                      {donutSlices[hoveredSlice].count}
                    </span>
                    <span 
                      className="text-[8px] font-extrabold uppercase tracking-wider truncate w-24 text-center mt-1 px-1 rounded"
                      style={{ color: donutSlices[hoveredSlice].color }}
                    >
                      {donutSlices[hoveredSlice].status}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Donut Legend */}
            <div className="flex flex-col gap-2">
              {donutSlices.map((slice, idx) => (
                <div 
                  key={slice.status} 
                  className={cn(
                    "flex items-center justify-between gap-4 px-3 py-1.5 rounded-xl border border-transparent transition-all duration-200 cursor-pointer",
                    hoveredSlice === idx ? "bg-slate-50 border-slate-100" : ""
                  )}
                  onMouseEnter={() => setHoveredSlice(idx)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="h-2.5 w-2.5 rounded-full" 
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="text-xs font-bold text-midnight-indigo capitalize">{slice.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-blue/80">{slice.count}</span>
                    <span className="text-[10px] font-semibold text-steel-gray">({(slice.percent * 100).toFixed(0)}%)</span>
                  </div>
                </div>
              ))}
              {donutSlices.length === 0 && (
                <span className="text-xs text-slate-400 italic text-center">Tidak ada data status</span>
              )}
            </div>
          </div>
        </Card>

        {/* Activity Chart - Premium Redesign */}
        <Card className="px-6 pt-6 pb-5 border-platinum-tint bg-white shadow-card rounded-2xl">
          <div className="mb-6 flex items-center justify-between">
            <div className="border-l-4 border-emerald-500 pl-4">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-blue">Aktivitas</h3>
              <p className="text-lg font-bold text-midnight-indigo mt-1">Distribusi Jenis Perjalanan</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 shadow-sm">
              <Route size={20} />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {statistics.activity_chart.map((activity) => {
              const pct = maxActivityCount > 0 ? (activity.count / maxActivityCount) * 100 : 0;
              const sharePct = activityTotal > 0 ? (activity.count / activityTotal) * 100 : 0;
              return (
                <div key={activity.activity_type_id} className="group flex flex-col gap-2 p-2 -m-2 rounded-xl transition-all duration-200 hover:bg-slate-50/60">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-midnight-indigo transition-colors duration-200 group-hover:text-emerald-600">
                      {activity.activity?.name || "Lainnya"}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-600 shadow-sm border border-emerald-100/50">
                        {activity.count} Pesanan
                      </span>
                      <span className="text-[11px] font-bold text-steel-gray">
                        ({sharePct.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700 ease-out group-hover:from-emerald-400 group-hover:to-cyan-400"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {statistics.activity_chart.length === 0 && (
              <span className="text-xs text-slate-400 italic text-center py-4">Tidak ada data aktivitas</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
