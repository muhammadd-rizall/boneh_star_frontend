import axios from '@/api/Axios';
import type { CompanyProfile, CompanyProfileFormData, CompanyProfileApiResponse } from '@/features/admin/company-profile/types/CompanyProfile';

const ENDPOINTS = {
  BASE: '/admin/company-profile',
};

export const companyProfileService = {
  getProfile: async (): Promise<CompanyProfile | null> => {
    try {
      const response = await axios.get<CompanyProfileApiResponse>(ENDPOINTS.BASE);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching company profile:', error);
      throw error;
    }
  },

  updateProfile: async (data: CompanyProfileFormData): Promise<CompanyProfile> => {
    try {
      const formData = new FormData();
      
      formData.append('company_name', data.company_name);
      formData.append('address', data.address);
      
      if (data.email) formData.append('email', data.email);
      if (data.description) formData.append('description', data.description);
      
      // Phone array
      data.phone.forEach((num, index) => {
        formData.append(`phone[${index}]`, num);
      });
      
      // WhatsApp array
      data.whatsapp.forEach((num, index) => {
        formData.append(`whatsapp[${index}]`, num);
      });

      // Logo file
      if (data.logo instanceof File) {
        formData.append('logo', data.logo);
      }

      const response = await axios.post<CompanyProfileApiResponse>(ENDPOINTS.BASE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data.data as CompanyProfile;
    } catch (error) {
      console.error('Error updating company profile:', error);
      throw error;
    }
  },
};

export default companyProfileService;
