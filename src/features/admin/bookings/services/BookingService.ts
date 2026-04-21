import axios from '@/api/Axios';
import type { 
  Booking, 
  BookingFormData, 
  BookingApiResponse, 
  BookingStatistics,
  PaginatedData
} from '@/features/admin/bookings/types/Booking';

const ENDPOINTS = {
  BASE: '/admin/bookings',
  DETAIL: (id: string) => `/admin/bookings/${id}`,
  TRASHED: '/admin/bookings/trashed',
  RESTORE: (id: string) => `/admin/bookings/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/bookings/${id}/force-delete`,
};

export const bookingService = {
  getAll: async (search?: string): Promise<{ bookings: Booking[], statistics: BookingStatistics | null }> => {
    try {
      const response = await axios.get<BookingApiResponse>(ENDPOINTS.BASE, {
        params: { search }
      });
      const data = response.data.data;
      
      let bookings: Booking[] = [];
      if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as PaginatedData<Booking>).data)) {
        bookings = (data as PaginatedData<Booking>).data;
      } else if (Array.isArray(data)) {
        bookings = data as Booking[];
      }

      return {
        bookings,
        statistics: response.data.statistics || null
      };
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Booking[]> => {
    try {
      const response = await axios.get<BookingApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed bookings:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Booking> => {
    try {
      const response = await axios.get<BookingApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as Booking;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  create: async (data: BookingFormData): Promise<Booking> => {
    try {
      const response = await axios.post<BookingApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  update: async (id: string, data: BookingFormData): Promise<Booking> => {
    try {
      const response = await axios.put<BookingApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as Booking;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<void> => {
    try {
      await axios.post(ENDPOINTS.RESTORE(id));
    } catch (error) {
      console.error(`Error restoring booking ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting booking ${id}:`, error);
      throw error;
    }
  },
};

export default bookingService;
