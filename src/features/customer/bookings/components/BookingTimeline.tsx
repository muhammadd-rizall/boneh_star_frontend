import type { TimelineEvent } from '../services/HistoryService';
import { CheckCircle2, Clock, XCircle, Info } from 'lucide-react';
import { formatDate } from '@/utils/formatter';

interface Props {
  timeline: TimelineEvent[];
}

export default function BookingTimeline({ timeline }: Props) {
  return (
    <div className="flex flex-col gap-0">
      {timeline.map((event, index) => (
        <div key={index} className="flex gap-6 relative">
          {/* Connector Line */}
          {index !== timeline.length - 1 && (
            <div className="absolute left-[23px] top-10 bottom-[-24px] w-0.5 bg-slate-100" />
          )}
          
          <div className="flex-shrink-0 z-10">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-white shadow-sm ${getStatusColor(event.status)}`}>
              {getEventIcon(event.status)}
            </div>
          </div>
          
          <div className="pb-12 pt-2">
            <h4 className="text-base font-black tracking-tight text-slate-950">{event.event}</h4>
            <div className="flex items-center gap-2 mt-1 mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                {formatDate(event.time)}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-400 leading-relaxed max-w-lg">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'verified': case 'accepted': case 'completed': return 'bg-emerald-500 text-white';
    case 'pending': return 'bg-amber-400 text-white';
    case 'rejected': case 'cancelled': return 'bg-rose-500 text-white';
    default: return 'bg-orange-500 text-white';
  }
}

function getEventIcon(status: string) {
  switch (status) {
    case 'verified': case 'accepted': case 'completed': return <CheckCircle2 size={20} strokeWidth={2.5} />;
    case 'rejected': case 'cancelled': return <XCircle size={20} strokeWidth={2.5} />;
    case 'pending': return <Clock size={20} strokeWidth={2.5} />;
    default: return <Info size={20} strokeWidth={2.5} />;
  }
}
