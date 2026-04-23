import axios from '@/api/Axios';
import type { CompanyProfile, CompanyProfileFormData, CompanyProfileApiResponse } from '@/features/admin/company-profile/types/CompanyProfile';

const ENDPOINT = '/admin/company-profile';

function normalizeCompanyProfile(data: CompanyProfileApiResponse['data'] | CompanyProfile[] | null | undefined): CompanyProfile | null {
  if (Array.isArray(data)) {
    const primaryProfile = data.find((item) => item?.id === '1') ?? data[0];
    return primaryProfile ?? null;
  }

  return data ?? null;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
  ) {
    return (error as { response?: { data?: { message?: string } } }).response!.data!.message!;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export const companyProfileService = {
  // Ambil profil perusahaan
  getProfile: async (): Promise<CompanyProfile | null> => {
    try {
      const response = await axios.get<CompanyProfileApiResponse>(ENDPOINT);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch company profile');
      }

      return normalizeCompanyProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching global settings:', error);
      throw error;
    }
  },

  // Simpan atau Perbarui profil perusahaan
  updateProfile: async (data: CompanyProfileFormData): Promise<CompanyProfile> => {
    try {
      const formData = new FormData();
      formData.append('company_name', data.company_name);
      formData.append('address', data.address);

      formData.append('email', data.email || '');
      formData.append('description', data.description || '');

      const whatsappList = data.whatsapp
        .map((num) => num.trim())
        .filter(Boolean);

      if (whatsappList.length === 0) {
        formData.append('whatsapp[0]', '');
      } else {
        whatsappList.forEach((num, index) => {
          formData.append(`whatsapp[${index}]`, num);
        });
      }

      const socialMediaList = (data.social_media || []).filter(
        (social) => social.platform.trim() || social.url.trim()
      );

      if (socialMediaList.length === 0) {
        formData.append('social_media', '[]');
      } else {
        socialMediaList.forEach((social, index) => {
          formData.append(`social_media[${index}][platform]`, social.platform.trim());
          formData.append(`social_media[${index}][url]`, social.url.trim());
        });
      }

      if (data.logo instanceof File) {
        formData.append('logo', data.logo);
      }

      const response = await axios.post<CompanyProfileApiResponse>(ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Update failed');
      }

      return normalizeCompanyProfile(response.data.data) as CompanyProfile;
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Error updating profile');
      console.error('Update Profile Service Error:', message);
      throw new Error(message);
    }
  },
};

export default companyProfileService;
