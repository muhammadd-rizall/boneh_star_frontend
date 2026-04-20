import axios from '@/api/Axios';
import type { 
  BookingReportFilters, 
  BookingReportApiResponse 
} from '../types/BookingReport';

const ENDPOINTS = {
  BOOKINGS: '/admin/reports/bookings',
};

export const bookingReportService = {
  getBookingReport: async (filters: BookingReportFilters): Promise<BookingReportApiResponse> => {
    try {
      const response = await axios.get<BookingReportApiResponse>(ENDPOINTS.BOOKINGS, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking report:', error);
      throw error;
    }
  },
};

export default bookingReportService;
