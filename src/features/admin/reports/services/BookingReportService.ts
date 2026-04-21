import axios from '@/api/Axios';
import { downloadFile } from '@/utils/downloadHelper';
import type { 
  BookingReportFilters, 
  BookingReportApiResponse 
} from '../types/BookingReport';

const ENDPOINTS = {
  BOOKINGS: '/admin/reports/bookings',
  EXPORT_EXCEL: '/admin/reports/bookings/excel',
  EXPORT_PDF: '/admin/reports/bookings/pdf',
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

  exportExcel: async (filters: BookingReportFilters): Promise<void> => {
    try {
      const response = await axios.get(ENDPOINTS.EXPORT_EXCEL, {
        params: filters,
        responseType: 'blob',
      });
      const filename = `booking-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadFile(response.data, filename);
    } catch (error) {
      console.error('Error exporting booking report to Excel:', error);
      throw error;
    }
  },

  exportPdf: async (filters: BookingReportFilters): Promise<void> => {
    try {
      const response = await axios.get(ENDPOINTS.EXPORT_PDF, {
        params: filters,
        responseType: 'blob',
      });
      const filename = `booking-report-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadFile(response.data, filename);
    } catch (error) {
      console.error('Error exporting booking report to PDF:', error);
      throw error;
    }
  },
};
