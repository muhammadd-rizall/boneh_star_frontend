import { useToastStore } from '@/store/useToastStore';
import { CheckCircle2, AlertCircle, AlertTriangle, Info as InfoIcon, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 size={16} className="text-emerald-600 shrink-0" strokeWidth={2.5} />,
  error: <AlertCircle size={16} className="text-rose-600 shrink-0" strokeWidth={2.5} />,
  warning: <AlertTriangle size={16} className="text-amber-600 shrink-0" strokeWidth={2.5} />,
  info: <InfoIcon size={16} className="text-blue-600 shrink-0" strokeWidth={2.5} />,
};

const bgColors = {
  success: 'bg-emerald-50/90 border-emerald-200 text-emerald-800 shadow-emerald-100/50',
  error: 'bg-rose-50/90 border-rose-200 text-rose-800 shadow-rose-100/50',
  warning: 'bg-amber-50/90 border-amber-200 text-amber-800 shadow-amber-100/50',
  info: 'bg-blue-50/90 border-blue-200 text-blue-800 shadow-blue-100/50',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed right-5 top-20 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl border backdrop-blur-md p-4 shadow-xl transition-all duration-300 animate-in slide-in-from-right-5 fade-in ${bgColors[toast.type]}`}
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold leading-relaxed pr-2">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors shrink-0 p-0.5 rounded-lg hover:bg-slate-100/50"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
