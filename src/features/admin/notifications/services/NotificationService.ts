import axios from '@/api/Axios';
import type { 
  Notification, 
  NotificationApiResponse 
} from '@/features/admin/notifications/types/Notification';

const ENDPOINTS = {
  BASE: '/admin/notifications',
  MARK_AS_READ: (id: string) => `/admin/notifications/${id}/mark-as-read`,
  MARK_ALL_AS_READ: '/admin/notifications/mark-all-as-read',
  DETAIL: (id: string) => `/admin/notifications/${id}`,
};

export const notificationService = {
  getPaginated: async (params?: { page?: number }): Promise<{ 
    notifications: Notification[], 
    unreadCount: number,
    meta: any
  }> => {
    try {
      const response = await axios.get<NotificationApiResponse>(ENDPOINTS.BASE, { params });
      const data = response.data.data;
      
      return {
        notifications: data.data || [],
        unreadCount: response.data.unread_count || 0,
        meta: {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total
        }
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  markAsRead: async (id: string): Promise<Notification> => {
    try {
      const response = await axios.post<NotificationApiResponse>(ENDPOINTS.MARK_AS_READ(id));
      return response.data.data as Notification;
    } catch (error) {
      console.error(`Error marking notification ${id} as read:`, error);
      throw error;
    }
  },

  markAllAsRead: async (): Promise<void> => {
    try {
      await axios.post(ENDPOINTS.MARK_ALL_AS_READ);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting notification ${id}:`, error);
      throw error;
    }
  },
};

export default notificationService;
