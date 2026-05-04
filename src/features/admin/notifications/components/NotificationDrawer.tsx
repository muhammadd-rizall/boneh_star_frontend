import { X, Bell, Trash2, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { formatTimeAgo } from "@/utils/formatter";
import Button from "@/components/ui/Button";
import Loader from "@/components/feedback/Loader";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    unreadCount 
  } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="text-emerald-500" />;
      case 'warning': return <AlertCircle size={18} className="text-amber-500" />;
      case 'error': return <X size={18} className="text-rose-500" />;
      default: return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-slate-950/20 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed inset-y-0 right-0 z-[70] w-full max-w-sm border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={20} className="text-slate-900" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            </div>
            <button 
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between bg-slate-50/50 px-6 py-3 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500">{unreadCount} unread</span>
              <button 
                onClick={() => markAllAsRead()}
                className="text-xs font-semibold text-slate-900 hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                  <Bell size={32} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">All caught up!</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  No new notifications at the moment. We'll let you know when something happens.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`group relative flex gap-4 p-6 transition-colors hover:bg-slate-50 ${!notification.read_at ? 'bg-slate-50/30' : ''}`}
                    onClick={() => !notification.read_at && markAsRead(notification.id)}
                  >
                    <div className="mt-1 shrink-0">
                      {getIcon(notification.type || 'info')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!notification.read_at ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                        {notification.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-[10px] font-medium text-slate-400">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="absolute right-4 top-6 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>
                    {!notification.read_at && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 p-6">
            <Button 
              variant="outline" 
              className="w-full rounded-2xl"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
