import { useState, useCallback } from 'react';
import { notificationService } from '../services/NotificationService';
import type { CustomerNotification } from '../types/Notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    await fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    await notificationService.delete(id);
    await fetchNotifications();
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
