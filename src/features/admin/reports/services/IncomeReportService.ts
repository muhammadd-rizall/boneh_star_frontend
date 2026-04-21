import axios from '@/api/Axios';
import { downloadFile } from '@/utils/downloadHelper';
import type { 
  IncomeReportFilters, 
  IncomeReportApiResponse 
} from '../types/IncomeReport';

const ENDPOINTS = {
  INCOME: '/admin/reports/income',
  EXPORT_EXCEL: '/admin/reports/income/excel',
  EXPORT_PDF: '/admin/reports/income/pdf',
};

export const incomeReportService = {
  getIncomeReport: async (filters: IncomeReportFilters): Promise<IncomeReportApiResponse> => {
    try {
      const response = await axios.get<IncomeReportApiResponse>(ENDPOINTS.INCOME, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching income report:', error);
      throw error;
    }
  },

  exportExcel: async (filters: IncomeReportFilters): Promise<void> => {
    try {
      const response = await axios.get(ENDPOINTS.EXPORT_EXCEL, {
        params: filters,
        responseType: 'blob',
      });
      const filename = `income-report-${new Date().toISOString().split('T')[0]}.xlsx`;
      downloadFile(response.data, filename);
    } catch (error) {
      console.error('Error exporting income report to Excel:', error);
      throw error;
    }
  },

  exportPdf: async (filters: IncomeReportFilters): Promise<void> => {
    try {
      const response = await axios.get(ENDPOINTS.EXPORT_PDF, {
        params: filters,
        responseType: 'blob',
      });
      const filename = `income-report-${new Date().toISOString().split('T')[0]}.pdf`;
      downloadFile(response.data, filename);
    } catch (error) {
      console.error('Error exporting income report to PDF:', error);
      throw error;
    }
  },
};
