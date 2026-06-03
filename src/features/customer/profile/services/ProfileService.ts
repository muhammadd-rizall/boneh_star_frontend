import axios from '@/api/Axios';
import type { 
  CustomerProfile, 
  UpdateProfileData, 
  BookingStatistics, 
  ProfileApiResponse 
} from '../types/Profile';

const ENDPOINTS = {
  PROFILE: '/customer/profile',
  PICTURE: '/customer/profile/picture',
  STATISTICS: '/customer/statistics',
};

export const profileService = {
  getProfile: async (): Promise<CustomerProfile> => {
    const response = await axios.get<ProfileApiResponse<CustomerProfile>>(ENDPOINTS.PROFILE);
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<CustomerProfile> => {
    const response = await axios.patch<ProfileApiResponse<CustomerProfile>>(ENDPOINTS.PROFILE, data);
    return response.data.data;
  },

  updatePassword: async (data: any): Promise<void> => {
    await axios.patch(`${ENDPOINTS.PROFILE}/password`, data);
  },

  uploadPicture: async (file: File): Promise<CustomerProfile> => {
    const formData = new FormData();
    formData.append('profile_picture', file);
    
    const response = await axios.post<ProfileApiResponse<CustomerProfile>>(ENDPOINTS.PICTURE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  getStatistics: async (): Promise<BookingStatistics> => {
    const response = await axios.get<ProfileApiResponse<BookingStatistics>>(ENDPOINTS.STATISTICS);
    return response.data.data;
  },
};

export default profileService;
