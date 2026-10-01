import axios from '@/api/Axios';
import type { ActivityType, ActivityTypeFormData, ActivityTypeApiResponse, ActivityTypeStatistics } from '@/features/admin/activity-types/types/ActivityType';

const ENDPOINTS = {
  BASE: '/admin/activity-types',
  DETAIL: (id: string) => `/admin/activity-types/${id}`,
  TRASHED: '/admin/activity-types/trashed',
  RESTORE: (id: string) => `/admin/activity-types/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/activity-types/${id}/force-delete`,
};

export const activityTypeService = {
  getAll: async (search?: string): Promise<{ activityTypes: ActivityType[], statistics: ActivityTypeStatistics | null }> => {
    try {
      const response = await axios.get<ActivityTypeApiResponse>(ENDPOINTS.BASE, {
        params: { search, all: 'true' }
      });
      const responseData = response.data.data;
      
      let activityTypes: ActivityType[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        activityTypes = responseData.data;
      } else if (Array.isArray(responseData)) {
        activityTypes = responseData;
      }

      return {
        activityTypes,
        statistics: response.data.statistic || null
      };
    } catch (error) {
      console.error('Error fetching activity types:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<ActivityType[]> => {
    try {
      const response = await axios.get<ActivityTypeApiResponse>(ENDPOINTS.TRASHED);
      const data = response.data.data;
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching trashed activity types:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<ActivityType> => {
    try {
      const response = await axios.get<ActivityTypeApiResponse>(ENDPOINTS.DETAIL(id));
      return response.data.data as ActivityType;
    } catch (error) {
      console.error(`Error fetching activity type ${id}:`, error);
      throw error;
    }
  },

  create: async (data: ActivityTypeFormData): Promise<ActivityType> => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.image) formData.append('image', data.image);

      const response = await axios.post<ActivityTypeApiResponse>(ENDPOINTS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data as ActivityType;
    } catch (error) {
      console.error('Error creating activity type:', error);
      throw error;
    }
  },

  update: async (id: string, data: ActivityTypeFormData): Promise<ActivityType> => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', data.name);
      if (data.description !== undefined) formData.append('description', data.description || '');
      if (data.image !== undefined) {
        if (data.image) formData.append('image', data.image);
        else formData.append('image', '');
      }

      const response = await axios.post<ActivityTypeApiResponse>(ENDPOINTS.DETAIL(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.data as ActivityType;
    } catch (error) {
      console.error(`Error updating activity type ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting activity type ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<ActivityType> => {
    try {
      const response = await axios.post<ActivityTypeApiResponse>(ENDPOINTS.RESTORE(id));
      return response.data.data as ActivityType;
    } catch (error) {
      console.error(`Error restoring activity type ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting activity type ${id}:`, error);
      throw error;
    }
  },
};

export default activityTypeService;
