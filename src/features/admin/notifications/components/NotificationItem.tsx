import type { Notification } from "@/features/admin/notifications/types/Notification"
import { Bell, Check, Calendar, Info, AlertTriangle, AlertCircle } from "lucide-react"

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case 'info': return <Info size={18} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={18} className="text-amber-500" />;
      case 'error': return <AlertCircle size={18} className="text-rose-500" />;
      case 'success': return <Check size={18} className="text-green-500" />;
      default: return <Bell size={18} className="text-slate-400" />;
    }
  };

  return (
    <div className={`group relative flex gap-4 rounded-2xl border p-4 transition-all duration-200 ${
      notification.is_read 
        ? "border-slate-100 bg-white" 
        : "border-indigo-100 bg-indigo-50/30 ring-1 ring-indigo-50"
    }`}>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
        notification.is_read ? "border-slate-200 bg-slate-50" : "border-indigo-200 bg-white"
      }`}>
        {getIcon()}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className={`text-sm font-semibold ${notification.is_read ? "text-slate-700" : "text-slate-900"}`}>
            {notification.title}
          </h4>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <Calendar size={12} />
            {new Date(notification.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${notification.is_read ? "text-slate-500" : "text-slate-600"}`}>
          {notification.message}
        </p>

        <div className="mt-3 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {!notification.is_read && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {!notification.is_read && (
        <div className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-indigo-500"></div>
      )}
    </div>
  );
}
