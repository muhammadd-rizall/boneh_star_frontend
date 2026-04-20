import { useNotifications } from "@/features/admin/notifications/hooks/useNotifications"
import NotificationList from "@/features/admin/notifications/components/NotificationList"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { Bell, CheckCheck, RefreshCw } from "lucide-react"
import ErrorState from "@/components/feedback/ErrorState"

export default function NotificationPage() {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    refetch, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    page,
    setPage,
    meta
  } = useNotifications()

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-sm text-slate-500 font-medium">
            You have {unreadCount} unread messages
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            icon={RefreshCw} 
            onClick={() => refetch()}
            loading={loading}
          >
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            icon={CheckCheck} 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <NotificationList
          notifications={notifications}
          loading={loading}
          onMarkAsRead={markAsRead}
          onDelete={deleteNotification}
        />

        {meta && meta.last_page > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button 
              size="sm" 
              variant="ghost" 
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm font-medium text-slate-500">
              Page {page} of {meta.last_page}
            </span>
            <Button 
              size="sm" 
              variant="ghost" 
              disabled={page === meta.last_page}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
