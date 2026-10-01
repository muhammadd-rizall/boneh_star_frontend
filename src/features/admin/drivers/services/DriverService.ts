import axios from '@/api/Axios';
import type { Driver, DriverApiResponse, DriverStatistics } from '@/features/admin/drivers/types/Driver';

const ENDPOINTS = {
  BASE: '/admin/drivers',
  DETAIL: (id: string) => `/admin/drivers/${id}`,
  UPDATE: (id: string) => `/admin/drivers/${id}?_method=PUT`, // Laravel trick for multipart PUT
  TRASHED: '/admin/drivers/trashed',
  RESTORE: (id: string) => `/admin/drivers/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/drivers/${id}/force-delete`,
};

const getApiOrigin = () => {
  const baseURL = axios.defaults.baseURL ?? '';

  try {
    return new URL(baseURL).origin;
  } catch {
    return '';
  }
};

const normalizePhotoUrl = (photo?: string | null) => {
  if (!photo) return null;
  if (/^https?:\/\//i.test(photo) || photo.startsWith('data:') || photo.startsWith('blob:')) {
    return photo;
  }

  const apiOrigin = getApiOrigin();
  if (!apiOrigin) return photo;

  const normalizedPath = photo.startsWith('/') ? photo : `/${photo}`;
  if (normalizedPath.startsWith('/storage/')) {
    return `${apiOrigin}${normalizedPath}`;
  }

  return `${apiOrigin}/storage${normalizedPath}`;
};

const mapDriver = (driver: Driver & { photo_url?: string | null }): Driver => ({
  ...driver,
  photo: normalizePhotoUrl(driver.photo_url ?? driver.photo),
});

const mapDrivers = (drivers: Array<Driver & { photo_url?: string | null }>): Driver[] =>
  drivers.map(mapDriver);

export const driverService = {
  getAll: async (search?: string): Promise<{ drivers: Driver[], statistics: DriverStatistics | null }> => {
    try {
      const response = await axios.get<DriverApiResponse>(ENDPOINTS.BASE, {
        params: { search, all: 'true' }
      });
      const responseData = response.data.data;
      
      let drivers: Driver[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        drivers = mapDrivers(responseData.data as Array<Driver & { photo_url?: string | null }>);
      } else if (Array.isArray(responseData)) {
        drivers = mapDrivers(responseData as Array<Driver & { photo_url?: string | null }>);
      }

      return {
        drivers,
        statistics: response.data.statistic || response.data.statistics || null
      };
    } catch (error) {
      console.error('Error fetching drivers:', error);
      throw error;
    }
  },

  getTrashed: async (): Promise<Driver[]> => {
    try {
      const response = await axios.get<DriverApiResponse>(ENDPOINTS.TRASHED);
      const responseData = response.data.data;
      
      let drivers: Driver[] = [];
      if (responseData && typeof responseData === 'object' && 'data' in responseData && Array.isArray(responseData.data)) {
        drivers = mapDrivers(responseData.data as Array<Driver & { photo_url?: string | null }>);
      } else if (Array.isArray(responseData)) {
        drivers = mapDrivers(responseData as Array<Driver & { photo_url?: string | null }>);
      }
      
      return drivers;
    } catch (error) {
      console.error('Error fetching trashed drivers:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Driver> => {
    try {
      const response = await axios.get<DriverApiResponse>(ENDPOINTS.DETAIL(id));
      return mapDriver(response.data.data as Driver & { photo_url?: string | null });
    } catch (error) {
      console.error(`Error fetching driver ${id}:`, error);
      throw error;
    }
  },

  create: async (data: FormData): Promise<Driver> => {
    try {
      const response = await axios.post<DriverApiResponse>(ENDPOINTS.BASE, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return mapDriver(response.data.data as Driver & { photo_url?: string | null });
    } catch (error) {
      console.error('Error creating driver:', error);
      throw error;
    }
  },

  update: async (id: string, data: FormData): Promise<Driver> => {
    try {
      // We use POST with _method=PUT because multipart/form-data doesn't work natively with PUT in Laravel
      const response = await axios.post<DriverApiResponse>(ENDPOINTS.UPDATE(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return mapDriver(response.data.data as Driver & { photo_url?: string | null });
    } catch (error) {
      console.error(`Error updating driver ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.DETAIL(id));
    } catch (error) {
      console.error(`Error deleting driver ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<Driver> => {
    try {
      const response = await axios.post<DriverApiResponse>(ENDPOINTS.RESTORE(id));
      return mapDriver(response.data.data as Driver & { photo_url?: string | null });
    } catch (error) {
      console.error(`Error restoring driver ${id}:`, error);
      throw error;
    }
  },

  forceDelete: async (id: string): Promise<void> => {
    try {
      await axios.delete(ENDPOINTS.FORCE_DELETE(id));
    } catch (error) {
      console.error(`Error force deleting driver ${id}:`, error);
      throw error;
    }
  },
};

export default driverService;
