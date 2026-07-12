import { X, Bell, Trash2, CheckCircle2, Info, AlertCircle, ExternalLink } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { formatTimeAgo } from "@/utils/formatter";
import { Button } from "@/components/ui/Button";
import Loader from "@/components/feedback/Loader";
import { useNavigate } from "react-router-dom";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state?: ReturnType<typeof useNotifications>;
}

export default function NotificationDrawer({ isOpen, onClose, state }: NotificationDrawerProps) {
  const navigate = useNavigate();
  const localState = useNotifications();
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    unreadCount 
  } = state || localState;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} strokeWidth={2.5} className="text-emerald-500" />;
      case 'warning': return <AlertCircle size={20} strokeWidth={2.5} className="text-sunset-gold" />;
      case 'error': return <X size={20} strokeWidth={2.5} className="text-red-500" />;
      default: return <Info size={20} strokeWidth={2.5} className="text-action-blue" />;
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

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
    const url = getTargetUrl(notification);
    if (url) {
      onClose();
      navigate(url);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-midnight-indigo/30 backdrop-blur-sm transition-all duration-500 animate-in fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed inset-y-0 right-0 z-[70] w-full max-w-sm border-l border-platinum-tint bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-platinum-tint/50 p-8">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-cloud-mist text-midnight-indigo shadow-sm">
                <Bell size={22} strokeWidth={2.5} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-4 ring-white" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-midnight-indigo tracking-tight">Notifikasi</h2>
                <p className="text-xs font-medium text-slate-blue opacity-60">Info terbaru sistem & pesanan</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="rounded-xl p-2 text-slate-blue hover:bg-cloud-mist hover:text-midnight-indigo transition-all active:scale-90"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
          </div>

          {/* Actions Bar */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between bg-cloud-mist/30 px-8 py-3.5 border-b border-platinum-tint/40">
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-blue opacity-60">{unreadCount} belum dibaca</span>
              <button 
                onClick={() => markAllAsRead()}
                className="text-xs font-bold text-action-blue hover:text-glacier-blue transition-colors"
              >
                Tandai semua dibaca
              </button>
            </div>
          )}

          {/* List Content */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:none]">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-8 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[32px] bg-cloud-mist border border-platinum-tint shadow-sm text-platinum-tint">
                  <Bell size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-midnight-indigo">Sudah dibaca semua!</h3>
                <p className="mt-2 text-sm font-medium text-slate-blue opacity-60 leading-relaxed max-w-[220px] mx-auto">
                  Belum ada notifikasi baru saat ini. Kami akan beri tahu jika ada update.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-platinum-tint/30">
                {notifications.map((notification) => {
                  const hasTarget = !!getTargetUrl(notification);
                  return (
                    <div 
                      key={notification.id}
                      className={`group relative flex gap-4 p-8 transition-all hover:bg-cloud-mist/20 cursor-pointer ${!notification.is_read ? 'bg-blue-50/20' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="mt-1 shrink-0 transition-transform group-hover:scale-110 duration-300">
                        {getIcon(notification.type || 'info')}
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm leading-snug tracking-tight ${!notification.is_read ? 'font-bold text-midnight-indigo' : 'font-medium text-slate-blue opacity-80'}`}>
                            {notification.title}
                          </p>
                          {hasTarget && (
                            <ExternalLink size={12} className="text-action-blue opacity-60 shrink-0" />
                          )}
                        </div>
                        <p className="mt-1.5 text-xs font-medium text-slate-blue opacity-70 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="mt-3 text-[10px] font-bold text-steel-gray uppercase tracking-widest opacity-60">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="absolute right-4 top-8 p-1.5 rounded-lg text-slate-blue/30 hover:bg-red-50 hover:text-red-500 active:scale-90 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                      {!notification.is_read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-action-blue rounded-full shadow-[0_0_8px_rgba(0,107,255,0.4)]" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-platinum-tint p-8 bg-white">
            <Button 
              variant="outline" 
              className="w-full rounded-xl font-medium h-12 border-platinum-tint hover:bg-cloud-mist"
              onClick={onClose}
            >
              Tutup Panel
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
