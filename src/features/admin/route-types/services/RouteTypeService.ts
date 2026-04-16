import axios from '@/api/Axios';
import type { RouteType, RouteTypeFormData, RouteTypeApiResponse, RouteTypeStatistics } from '@/features/admin/route-types/types/RouteType';

const ENDPOINTS = {
  BASE: '/admin/route-types',
  DETAIL: (id: string) => `/admin/route-types/${id}`,
  TRASHED: '/admin/route-types/trashed',
  RESTORE: (id: string) => `/admin/route-types/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/route-types/${id}/force-delete`,
};

export const routeTypeService = {
  getAll: async (): Promise<{ routeTypes: RouteType[], statistics: RouteTypeStatistics | null }> => {
    try {
      const response = await axios.get<RouteTypeApiResponse>(ENDPOINTS.BASE);
      const responseData = response.data.data;
      
      let routeTypes: RouteType[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        routeTypes = responseData.data;
      } else if (Array.isArray(responseData)) {
        routeTypes = responseData;
      }

      return {
        routeTypes,
        statistics: response.data.statistic || null
      };
    } catch (error) {
      console.error('Error fetching route types:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<RouteType[]> => {
    try {
      const response = await axios.get<RouteTypeApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed route types:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<RouteType> => {
    try {
      const response = await axios.get<RouteTypeApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as RouteType;
    } catch (error) {
      console.error(`Error fetching route type ${id}:`, error);
      throw error;
    }
  },

  create: async (data: RouteTypeFormData): Promise<RouteType> => {
    try {
      const response = await axios.post<RouteTypeApiResponse>(ENDPOINTS.BASE, data);
      return response.data.data as RouteType;
    } catch (error) {
      console.error('Error creating route type:', error);
      throw error;
    }
  },

  update: async (id: string, data: RouteTypeFormData): Promise<RouteType> => {
    try {
      const response = await axios.put<RouteTypeApiResponse>(ENDPOINTS.DETAIL(id), data);
      return response.data.data as RouteType;
    } catch (error) {
      console.error(`Error updating route type ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting route type ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<RouteType> => {
    try {
      const response = await axios.post<RouteTypeApiResponse>(ENDPOINTS.RESTORE(id));
      return response.data.data as RouteType;
    } catch (error) {
      console.error(`Error restoring route type ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting route type ${id}:`, error);
      throw error;
    }
  },
};

export default routeTypeService;
