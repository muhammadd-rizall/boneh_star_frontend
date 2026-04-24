import type { CompanyProfile as BaseCompanyProfile } from "@/types/Database";

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface CompanyProfile extends Omit<BaseCompanyProfile, 'whatsapp' | 'social_media'> {
  whatsapp: string[];
  social_media: SocialMedia[] | null;
  email?: string | null;
  description?: string | null;
  logo?: string | null;
  updated_at?: string;
}

export interface CompanyProfileFormData {
  company_name: string;
  address: string;
  whatsapp: string[];
  social_media: SocialMedia[];
  email?: string;
  description?: string;
  logo?: File | null;
  remove_logo?: boolean;
}

export interface CompanyProfileApiResponse {
  success: boolean;
  message: string;
  data: CompanyProfile | null;
}
