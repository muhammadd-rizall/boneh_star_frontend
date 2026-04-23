import type { CompanyProfile, SocialMedia } from "@/features/admin/company-profile/types/CompanyProfile";

export const defaultCompanyProfile: CompanyProfile = {
  id: "",
  company_name: "Boneh Star",
  address: "Alamat belum diatur",
  whatsapp: [],
  social_media: [],
  email: "",
  description: "",
  logo: null,
  created_at: "",
  updated_at: "",
};

export function normalizeWhatsApp(list: any): string[] {
  if (!list) return [];
  if (Array.isArray(list)) return list;
  if (typeof list === 'string') {
    try {
      const parsed = JSON.parse(list);
      return Array.isArray(parsed) ? parsed : [list];
    } catch {
      return [list];
    }
  }
  return [];
}

export function normalizeSocialMedia(socialMedia: any): SocialMedia[] {
  if (!socialMedia) return [];
  if (Array.isArray(socialMedia)) return socialMedia;
  if (typeof socialMedia === 'string') {
    try {
      const parsed = JSON.parse(socialMedia);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

/**
 * Karena Backend (CompanyProfileResource) sudah mengembalikan asset() URL,
 * kita hanya perlu memastikan path tersebut valid.
 */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  // Jika sudah berupa URL (http/https), gunakan langsung
  if (path.startsWith("http")) return path;
  
  // Fallback jika backend mengirim path relatif (cadangan)
  const storageUrl = "http://localhost:8000/storage/";
  return `${storageUrl}${path.replace(/^\//, "")}`;
}

export function buildWhatsAppHref(whatsapp: string): string {
  const cleanNumber = whatsapp.replace(/\D/g, "");
  const formattedNumber = cleanNumber.startsWith("0") 
    ? "62" + cleanNumber.slice(1) 
    : cleanNumber.startsWith("62") ? cleanNumber : "62" + cleanNumber;
  return `https://wa.me/${formattedNumber}`;
}
