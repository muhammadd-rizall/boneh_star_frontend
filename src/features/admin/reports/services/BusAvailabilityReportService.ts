import axios from '@/api/Axios';
import type { 
  BusAvailabilityReportFilters, 
  BusAvailabilityReportApiResponse 
} from '../types/BusAvailabilityReport';

const ENDPOINTS = {
  BUS_AVAILABILITY: '/admin/reports/bus-availability',
};

export const busAvailabilityReportService = {
  getBusAvailabilityReport: async (filters: BusAvailabilityReportFilters): Promise<BusAvailabilityReportApiResponse> => {
    try {
      const response = await axios.get<BusAvailabilityReportApiResponse>(ENDPOINTS.BUS_AVAILABILITY, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching bus availability report:', error);
      throw error;
    }
  },
};

export default busAvailabilityReportService;
