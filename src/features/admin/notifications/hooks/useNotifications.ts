import { useEffect, useState, useCallback, useRef } from "react"
import { notificationService } from "@/features/admin/notifications/services/NotificationService"
import type { Notification } from "@/features/admin/notifications/types/Notification"

// Poll for unread count every 30 seconds to avoid hammering the server
const POLL_INTERVAL_MS = 30_000

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<any>(null)
  const [page, setPage] = useState(1)
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null)

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

  /** Lightweight poll — only fetches unread count to avoid loading the full list */
  const pollUnreadCount = useCallback(async () => {
    try {
      const { unreadCount } = await notificationService.getPaginated({ page: 1 })
      setUnreadCount(unreadCount)
    } catch {
      // Silently ignore polling errors
    }
  }, [])

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

  // Initial full fetch on mount
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Polling: only lightweight unread-count check every 30s
  useEffect(() => {
    pollTimer.current = setInterval(pollUnreadCount, POLL_INTERVAL_MS)
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current)
    }
  }, [pollUnreadCount])

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
