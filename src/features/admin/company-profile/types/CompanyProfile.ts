import type { CompanyProfile as BaseCompanyProfile } from "@/types/Database";

export type CompanyProfile = BaseCompanyProfile;

export interface CompanyProfileFormData {
  company_name: string;
  address: string;
  phone: string[];
  whatsapp: string[];
  email?: string;
  description?: string;
  logo?: File | null;
}

export interface CompanyProfileApiResponse {
  success: boolean;
  message: string;
  data: CompanyProfile | null;
}
