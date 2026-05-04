import PublicLayout from '@/layouts/public/PublicLayout';
import { useNotifications } from '@/features/customer/notifications/hooks/useNotifications';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import { Section, Container } from '@/components/ui/PageComponents';
import { Bell, Trash2, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/utils/formatter';

export default function NotificationIndexPage() {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  if (loading) return <PublicLayout><div className="flex h-[60vh] items-center justify-center"><Loader /></div></PublicLayout>;

  return (
    <PublicLayout>
      <Section className="pt-32 pb-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black text-slate-900">Notifikasi</h1>
                <p className="mt-1 text-slate-500">Pantau informasi terbaru perjalanan Anda.</p>
              </div>
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Tandai semua dibaca
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {notifications.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
                  <Bell className="mx-auto text-slate-300 mb-4" size={40} />
                  <h3 className="text-lg font-bold text-slate-900">Tidak ada notifikasi</h3>
                </div>
              ) : (
                notifications.map((notif) => (
                  <Card key={notif.id} className={`transition-all ${!notif.is_read ? 'border-orange-200 bg-orange-50/20' : ''}`}>
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${!notif.is_read ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Bell size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                        <p className="mt-1 text-xs font-medium text-slate-600 leading-relaxed">{notif.message}</p>
                        <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(notif.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notif.is_read && (
                          <Button variant="ghost" size="xs" onClick={() => markAsRead(notif.id)} icon={CheckCircle2} />
                        )}
                        <Button variant="ghost" size="xs" className="text-rose-600 hover:bg-rose-50" onClick={() => deleteNotification(notif.id)} icon={Trash2} />
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </Container>
      </Section>
    </PublicLayout>
  );
}
