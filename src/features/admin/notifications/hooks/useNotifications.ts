import { useEffect, useState, useCallback } from "react"
import { notificationService } from "@/features/admin/notifications/services/NotificationService"
import type { Notification } from "@/features/admin/notifications/types/Notification"

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<any>(null)
  const [page, setPage] = useState(1)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { notifications, unreadCount, meta } = await notificationService.getPaginated({ page })
      setNotifications(notifications)
      setUnreadCount(unreadCount)
      setMeta(meta)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch notifications";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [page])

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id)
      // Update local state to avoid full refetch
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Failed to mark as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.delete(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
      // If deleted unread, update count
      const wasUnread = notifications.find(n => n.id === id)?.is_read === false;
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error("Failed to delete notification:", err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    meta,
    page,
    setPage,
    refetch: fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  }
}
