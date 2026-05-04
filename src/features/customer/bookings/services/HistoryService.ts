import axios from '@/api/Axios';
import type { CustomerBooking } from '../types/Booking';

export interface TimelineEvent {
  event: string;
  status: string;
  time: string;
  description: string;
}

export interface BookingDetailWithTimeline {
  booking: CustomerBooking;
  timeline: TimelineEvent[];
}

// No changes needed, they match: /customer/history/...
const ENDPOINTS = {
  HISTORY: '/customer/history',
  DETAIL: (id: string) => `/customer/history/${id}`,
  INVOICE: (id: string) => `/customer/history/${id}/invoice`,
};

export const historyService = {
  getHistory: async (params?: { per_page?: number; page?: number }) => {
    const response = await axios.get(ENDPOINTS.HISTORY, { params });
    return response.data;
  },

  getDetail: async (id: string): Promise<BookingDetailWithTimeline> => {
    const response = await axios.get(ENDPOINTS.DETAIL(id));
    return response.data.data;
  },

  downloadInvoice: async (id: string) => {
    const response = await axios.get(ENDPOINTS.INVOICE(id), {
      responseType: 'blob',
    });
    return response.data;
  },
};
