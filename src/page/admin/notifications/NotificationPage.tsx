import { useNotifications, NotificationList } from "@/features/admin/notifications"
import { Button } from "@/components/ui/Button"
import ErrorState from "@/components/feedback/ErrorState"
import { useToastStore } from "@/store/useToastStore"
import { Bell, CheckCheck, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"

export default function NotificationPage() {
  const {
    notifications, unreadCount, loading, error, refetch,
    markAsRead, markAllAsRead, deleteNotification, page, setPage, meta,
  } = useNotifications()
  const showSuccess = useToastStore(state => state.showSuccess)

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      showSuccess("Semua notifikasi berhasil ditandai sebagai dibaca!");
    } catch (e) {}
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      showSuccess("Notifikasi ditandai sebagai dibaca.");
    } catch (e) {}
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      showSuccess("Notifikasi berhasil dihapus.");
    } catch (e) {}
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-2">
            Notifikasi
          </span>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Pusat Notifikasi</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {unreadCount > 0 ? (
              <span className="font-medium text-slate-700">{unreadCount} pesan belum dibaca</span>
            ) : (
              "Semua pesan telah dibaca"
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={() => refetch()} loading={loading}>
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Tandai Semua Dibaca
          </Button>
        </div>
      </div>

      {/* ── Unread Badge ── */}
      {unreadCount > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-4 py-3">
          <Bell size={15} className="text-sky-500 flex-shrink-0" />
          <p className="text-sm font-medium text-sky-700">
            Anda memiliki <span className="font-bold">{unreadCount}</span> notifikasi yang belum dibaca
          </p>
        </div>
      )}

      {/* ── List ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDelete}
        />
      </div>

      {/* ── Pagination ── */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Halaman {meta.current_page} dari {meta.last_page}
          </p>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" icon={ChevronLeft} disabled={page === 1} onClick={() => setPage(page - 1)} />
            <Button size="sm" variant="outline" icon={ChevronRight} disabled={page === meta.last_page} onClick={() => setPage(page + 1)} />
          </div>
        </div>
      )}
    </div>
  )
}
