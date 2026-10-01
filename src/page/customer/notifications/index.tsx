import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useNotifications } from '@/features/customer/notifications/hooks/useNotifications';
import Loader from '@/components/feedback/Loader';
import { Bell, Trash2, CheckCircle2, Clock, Bus, Receipt, CreditCard, ExternalLink, CheckCheck, Inbox } from 'lucide-react';
import { formatDate } from '@/utils/formatter';
import { useNavigate } from 'react-router-dom';

export default function NotificationIndexPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking': return Bus;
      case 'quotation': return Receipt;
      case 'payment': return CreditCard;
      default: return Bell;
    }
  };

  const getIconBg = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-cloud-mist text-steel-gray';
    switch (type) {
      case 'booking': return 'bg-action-blue/10 text-action-blue';
      case 'quotation': return 'bg-sunset-gold/10 text-sunset-gold';
      case 'payment': return 'bg-emerald-50 text-emerald-600';
      default: return 'bg-midnight-indigo/10 text-midnight-indigo';
    }
  };

  const getAccentColor = (type: string) => {
    switch (type) {
      case 'booking': return 'from-action-blue';
      case 'quotation': return 'from-sunset-gold';
      case 'payment': return 'from-emerald-500';
      default: return 'from-midnight-indigo';
    }
  };

  const getTargetUrl = (notif: any) => {
    if (!notif.reference_id) return null;
    switch (notif.type) {
      case 'booking':
      case 'quotation':
      case 'payment':
        return `/customer/bookings/${notif.reference_id}`;
      default:
        return null;
    }
  };

  const handleAction = (notif: any) => {
    const url = getTargetUrl(notif);
    if (!notif.is_read) markAsRead(notif.id);
    if (url) navigate(url);
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader />
        </div>
      </CustomerLayout>
    );
  }

  const unread = notifications.filter(n => !n.is_read);
  const read = notifications.filter(n => n.is_read);

  return (
    <CustomerLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-steel-gray mb-1">
            Customer Portal
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-midnight-indigo">
              Notifikasi
            </h1>
            {unreadCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-action-blue px-2 text-[11px] font-black text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-blue mt-1">
            Pembaruan status pemesanan dan aktivitas akun Anda.
          </p>
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-platinum-tint text-sm font-semibold text-slate-blue hover:text-midnight-indigo hover:border-steel-gray transition-all cursor-pointer shadow-sm"
          >
            <CheckCheck size={15} className="text-action-blue" />
            Tandai Semua Dibaca
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-pale-gray bg-white py-24 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-cloud-mist border border-pale-gray">
            <Inbox className="text-steel-gray" size={32} strokeWidth={1.5} />
          </div>
          <h3 className="text-base font-bold text-midnight-indigo">Belum Ada Notifikasi</h3>
          <p className="mt-2 text-sm text-slate-blue max-w-xs leading-relaxed">
            Semua pemberitahuan terkait pemesanan dan akun Anda akan tampil di sini.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Unread section */}
          {unread.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-steel-gray mb-3 ml-1">
                Belum Dibaca ({unread.length})
              </p>
              <div className="flex flex-col gap-3">
                {unread.map((notif) => {
                  const Icon = getIcon(notif.type);
                  const targetUrl = getTargetUrl(notif);
                  return (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      Icon={Icon}
                      iconBg={getIconBg(notif.type, false)}
                      accentColor={getAccentColor(notif.type)}
                      targetUrl={targetUrl}
                      onAction={handleAction}
                      onMarkRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Read section */}
          {read.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-steel-gray mb-3 ml-1">
                Sudah Dibaca ({read.length})
              </p>
              <div className="flex flex-col gap-2">
                {read.map((notif) => {
                  const Icon = getIcon(notif.type);
                  const targetUrl = getTargetUrl(notif);
                  return (
                    <NotificationCard
                      key={notif.id}
                      notif={notif}
                      Icon={Icon}
                      iconBg={getIconBg(notif.type, true)}
                      accentColor=""
                      targetUrl={targetUrl}
                      onAction={handleAction}
                      onMarkRead={markAsRead}
                      onDelete={deleteNotification}
                      dimmed
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </CustomerLayout>
  );
}

// ── NotificationCard component ────────────────────────────────────────────────
function NotificationCard({
  notif, Icon, iconBg, accentColor, targetUrl, onAction, onMarkRead, onDelete, dimmed = false,
}: {
  notif: any;
  Icon: any;
  iconBg: string;
  accentColor: string;
  targetUrl: string | null;
  onAction: (n: any) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  dimmed?: boolean;
}) {
  return (
    <div 
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest('button')) return;
        onAction(notif);
      }}
      className={`relative flex items-start gap-4 p-5 rounded-2xl border transition-all duration-200 group cursor-pointer ${
        !dimmed
          ? 'bg-white border-platinum-tint shadow-[0_2px_12px_-4px_rgba(11,53,88,0.08)] hover:shadow-[0_4px_20px_-6px_rgba(11,53,88,0.12)]'
          : 'bg-cloud-mist border-pale-gray hover:bg-white hover:border-platinum-tint'
      }`}
    >
      {/* Left accent */}
      {!dimmed && accentColor && (
        <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b ${accentColor} to-transparent`} />
      )}

      {/* Icon */}
      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${iconBg}`}>
        <Icon size={18} strokeWidth={2} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h4 className={`text-sm font-bold leading-snug ${!dimmed ? 'text-midnight-indigo' : 'text-slate-blue'}`}>
            {notif.title}
          </h4>
          <div className="flex items-center gap-1 shrink-0 text-[10px] font-semibold text-steel-gray">
            <Clock size={11} />
            <span>{formatDate(notif.created_at)}</span>
          </div>
        </div>

        <p className={`text-xs leading-relaxed mt-1 ${!dimmed ? 'text-slate-blue' : 'text-steel-gray'}`}>
          {notif.message}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            {targetUrl && (
              <button
                onClick={() => onAction(notif)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-midnight-indigo/5 hover:bg-midnight-indigo text-midnight-indigo hover:text-white border border-midnight-indigo/10 hover:border-midnight-indigo transition-all duration-200 cursor-pointer"
              >
                Lihat Detail
                <ExternalLink size={11} strokeWidth={2.5} />
              </button>
            )}
            {!notif.is_read && (
              <button
                onClick={() => onMarkRead(notif.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100 transition-all cursor-pointer"
              >
                Tandai Dibaca
                <CheckCircle2 size={11} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <button
            onClick={() => onDelete(notif.id)}
            className="p-1.5 rounded-lg text-steel-gray hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer opacity-70 md:opacity-0 md:group-hover:opacity-100"
            title="Hapus notifikasi"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
