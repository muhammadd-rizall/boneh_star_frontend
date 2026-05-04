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
        <div key={index} className="flex gap-4 relative">
          {/* Connector Line */}
          {index !== timeline.length - 1 && (
            <div className="absolute left-[19px] top-8 bottom-[-16px] w-0.5 bg-slate-100" />
          )}
          
          <div className="flex-shrink-0 z-10">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white ${getStatusColor(event.status)}`}>
              {getEventIcon(event.status)}
            </div>
          </div>
          
          <div className="pb-8 pt-1.5">
            <h4 className="text-sm font-bold text-slate-900">{event.event}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {formatDate(event.time)}
            </p>
            <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-md">{event.description}</p>
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
    default: return 'bg-sky-500 text-white';
  }
}

function getEventIcon(status: string) {
  switch (status) {
    case 'verified': case 'accepted': case 'completed': return <CheckCircle2 size={16} />;
    case 'rejected': case 'cancelled': return <XCircle size={16} />;
    case 'pending': return <Clock size={16} />;
    default: return <Info size={16} />;
  }
}
