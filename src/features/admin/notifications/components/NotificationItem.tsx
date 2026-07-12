import type { Notification } from "@/features/admin/notifications/types/Notification"
import { Bell, Check, Calendar, Info, AlertTriangle, AlertCircle, ExternalLink, Trash2, CheckSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (notification.type) {
      case 'info': return <Info size={18} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={18} className="text-amber-500" />;
      case 'error': return <AlertCircle size={18} className="text-rose-500" />;
      case 'success': return <Check size={18} className="text-green-500" />;
      default: return <Bell size={18} className="text-slate-400" />;
    }
  };

  const getTargetUrl = (notif: any) => {
    if (!notif.reference_id) return null;
    const refType = notif.reference_type?.toLowerCase() || '';
    const type = notif.type?.toLowerCase() || '';
    
    if (refType.includes('booking') || type.includes('booking')) {
      return '/admin/bookings';
    }
    if (refType.includes('quotation') || type.includes('quotation')) {
      return '/admin/quotations';
    }
    if (refType.includes('payment') || type.includes('payment')) {
      return '/admin/payments';
    }
    if (refType.includes('review') || type.includes('review')) {
      return '/admin/reviews';
    }
    return null;
  };

  const targetUrl = getTargetUrl(notification);

  const handleCardClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
    if (targetUrl) {
      navigate(targetUrl);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`group relative flex gap-4 rounded-2xl border p-4 transition-all duration-200 cursor-pointer hover:shadow-sm ${
        notification.is_read 
          ? "border-slate-100 bg-white hover:border-slate-200" 
          : "border-indigo-100 bg-indigo-50/30 ring-1 ring-indigo-50 hover:bg-indigo-50/50"
      }`}
    >
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
        notification.is_read ? "border-slate-200 bg-slate-50" : "border-indigo-200 bg-white"
      }`}>
        {getIcon()}
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className={`text-sm font-semibold truncate ${notification.is_read ? "text-slate-700" : "text-slate-900"}`}>
              {notification.title}
            </h4>
            {targetUrl && (
              <ExternalLink size={13} className="text-indigo-500 opacity-60 shrink-0" />
            )}
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 shrink-0">
            <Calendar size={12} />
            {new Date(notification.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className={`text-xs leading-relaxed break-words ${notification.is_read ? "text-slate-500" : "text-slate-600"}`}>
          {notification.message}
        </p>

        <div className="mt-3 flex items-center gap-3">
          {!notification.is_read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <CheckSquare size={12} />
              Tandai Dibaca
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
            Hapus
          </button>
        </div>
      </div>

      {!notification.is_read && (
        <div className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-indigo-500"></div>
      )}
    </div>
  );
}
