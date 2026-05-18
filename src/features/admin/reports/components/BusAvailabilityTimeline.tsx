
import React from 'react';
import type { BusAvailability, BusSchedule } from "../types/BusAvailabilityReport";
import { Card } from '@/components/ui/Card';

interface BusAvailabilityTimelineProps {
  data: BusAvailability[];
  period: {
    start_date: string;
    end_date: string;
  };
}

export default function BusAvailabilityTimeline({ data, period }: BusAvailabilityTimelineProps) {
  const start = new Date(period.start_date);
  const end = new Date(period.end_date);
  
  // Generate array of dates for the header
  const dates: Date[] = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getScheduleForDate = (bus: BusAvailability, date: Date): BusSchedule | undefined => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    
    return bus.schedules.find(s => {
      const sStart = new Date(s.departure_date);
      sStart.setHours(0, 0, 0, 0);
      const sEnd = s.return_date ? new Date(s.return_date) : sStart;
      sEnd.setHours(0, 0, 0, 0);
      
      return d >= sStart && d <= sEnd;
    });
  };

  return (
    <Card className="overflow-hidden border-slate-200/80 bg-white/90 shadow-sm">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Fleet Timeline</h3>
          <p className="text-sm text-slate-500 mt-1">Visual schedule of all bus units</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-indigo-500"></div>
            <span className="text-slate-600 font-medium">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-slate-200 bg-slate-50"></div>
            <span className="text-slate-600 font-medium">Available</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="sticky left-0 z-10 min-w-[200px] border-b border-r border-slate-100 bg-slate-50/80 p-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 backdrop-blur-sm">
                Armada / Unit
              </th>
              {dates.map((date, i) => (
                <th 
                  key={i} 
                  className={`min-w-[40px] border-b border-r border-slate-100 p-2 text-center text-[10px] font-bold ${isWeekend(date) ? "text-rose-500 bg-rose-50/30" : "text-slate-500"}`}
                >
                  <div className="flex flex-col">
                    <span>{date.toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                    <span className="text-sm">{date.getDate()}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((bus) => (
              <tr key={bus.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="sticky left-0 z-10 border-b border-r border-slate-100 bg-white/95 p-3 backdrop-blur-sm">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{bus.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{bus.plat_number}</span>
                  </div>
                </td>
                {dates.map((date, i) => {
                  const schedule = getScheduleForDate(bus, date);
                  return (
                    <td 
                      key={i} 
                      className={`border-b border-r border-slate-100 p-0 h-12 relative ${isWeekend(date) && !schedule ? "bg-rose-50/10" : ""}`}
                    >
                      {schedule && (
                        <div 
                          className={`absolute inset-1 rounded-md flex items-center justify-center text-[8px] font-bold text-white shadow-sm transition-all hover:scale-105 hover:z-20 cursor-help ${schedule.status === 'confirmed' ? "bg-indigo-500" : "bg-slate-400"}`}
                          title={`${schedule.booking_code} (${schedule.status})`}
                        >
                          {new Date(schedule.departure_date).getDate() === date.getDate() && (
                            <span className="truncate px-1">{schedule.booking_code.split('-').pop()}</span>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 italic">
          * Blok berwarna biru menandakan bus sudah terpesan (Confirmed). Blok abu-abu menandakan status lainnya. Weekend (Sabtu-Minggu) ditandai dengan warna merah.
        </p>
      </div>
    </Card>
  );
}
