import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useNotifications } from '@/features/customer/notifications/hooks/useNotifications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import { Bell, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { formatDate } from '@/utils/formatter';

export default function NotificationIndexPage() {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Pusat <span className="text-orange-600">Notifikasi</span>
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Informasi terbaru mengenai pemesanan dan aktivitas akun Anda.
          </p>
        </div>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="font-bold">
            Tandai semua dibaca
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
              <Bell className="text-slate-300" size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Belum ada notifikasi</h3>
            <p className="mt-1 text-sm text-slate-500">Semua pemberitahuan akan muncul di sini.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <Card 
              key={notif.id} 
              className={`flex items-start gap-4 transition-all hover:bg-slate-50 ${
                !notif.is_read ? 'border-l-4 border-l-orange-500 shadow-md shadow-slate-200/50' : ''
              }`}
            >
              <div className={`mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                !notif.is_read ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-400'
              }`}>
                <Bell size={20} />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${!notif.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                    {notif.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock size={12} />
                    {formatDate(notif.created_at)}
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{notif.message}</p>
                
                <div className="mt-3 flex items-center gap-2">
                  {!notif.is_read && (
                    <Button 
                      variant="ghost" 
                      size="xs" 
                      onClick={() => markAsRead(notif.id)} 
                      icon={CheckCircle2}
                      className="text-emerald-600 hover:bg-emerald-50"
                    >
                      Baca
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="xs" 
                    className="text-rose-600 hover:bg-rose-50" 
                    onClick={() => deleteNotification(notif.id)} 
                    icon={Trash2}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </CustomerLayout>
  );
}
