import axios from '@/api/Axios';
import type { NotificationApiResponse } from '../types/Notification';

const ENDPOINTS = {
  LIST: '/customer/notifications',
  READ: (id: string) => `/customer/notifications/${id}/mark-as-read`,
  READ_ALL: '/customer/notifications/mark-all-as-read',
  DELETE: (id: string) => `/customer/notifications/${id}`,
};

export const notificationService = {
  getAll: async (params?: { page?: number; per_page?: number }) => {
    const response = await axios.get<NotificationApiResponse>(ENDPOINTS.LIST, { params });
    return response.data;
  },

  markAsRead: async (id: string) => {
    await axios.patch(ENDPOINTS.READ(id));
  },

  markAllAsRead: async () => {
    await axios.post(ENDPOINTS.READ_ALL);
  },

  delete: async (id: string) => {
    await axios.delete(ENDPOINTS.DELETE(id));
  },
};

export default notificationService;
