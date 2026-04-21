import type { Notification } from "@/features/admin/notifications/types/Notification"
import NotificationItem from "./NotificationItem"
import EmpetyState from "@/components/feedback/EmpetyState"
import { Bell } from "lucide-react"

interface NotificationListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationList({ 
  notifications, 
  loading, 
  onMarkAsRead, 
  onDelete 
}: NotificationListProps) {
  if (!loading && notifications.length === 0) {
    return (
      <EmpetyState
        icon={Bell}
        title="No notifications"
        description="You're all caught up! No new notifications for now."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDelete={onDelete}
        />
      ))}
      
      {loading && (
        <div className="flex flex-col gap-3 opacity-50">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100"></div>
          ))}
        </div>
      )}
    </div>
  );
}
