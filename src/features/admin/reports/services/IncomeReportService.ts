import axios from '@/api/Axios';
import type { 
  IncomeReportFilters, 
  IncomeReportApiResponse 
} from '../types/IncomeReport';

const ENDPOINTS = {
  INCOME: '/admin/reports/income',
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
};

export default incomeReportService;
