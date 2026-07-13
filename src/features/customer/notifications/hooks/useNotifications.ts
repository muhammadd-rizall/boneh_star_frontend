import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '../services/NotificationService';
import type { CustomerNotification } from '../types/Notification';
import { useToastStore } from '@/store/useToastStore';

export function useNotifications() {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToastStore();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAll();
      setNotifications(data.data.data);
      setUnreadCount(data.unread_count);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read:", err);
      await fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      showSuccess('Semua notifikasi ditandai sebagai dibaca');
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      showError('Gagal menandai semua notifikasi');
      await fetchNotifications();
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      const wasUnread = notifications.find(n => n.id === id)?.is_read === false;
      if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
      showSuccess('Notifikasi berhasil dihapus');
    } catch (err) {
      console.error("Failed to delete notification:", err);
      showError('Gagal menghapus notifikasi');
      await fetchNotifications();
    }
  };

  return { 
    notifications, 
    unreadCount, 
    loading, 
    refresh: fetchNotifications,
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  };
}
