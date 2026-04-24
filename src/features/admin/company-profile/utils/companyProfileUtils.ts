import type { CompanyProfile, SocialMedia } from "@/features/admin/company-profile/types/CompanyProfile";
import { 
  faInstagram, 
  faFacebook, 
  faYoutube, 
  faTiktok, 
  faThreads,
  faWhatsapp, 
  faXTwitter
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

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

export const SOCIAL_PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: faInstagram },
  { id: "facebook", label: "Facebook", icon: faFacebook },
  { id: "twitter", label: "Twitter / X", icon: faXTwitter },
  { id: "youtube", label: "YouTube", icon: faYoutube },
  { id: "tiktok", label: "TikTok", icon: faTiktok },
  { id: "threads", label: "Threads", icon: faThreads },
];

export function normalizeSocialPlatform(platform: string): string {
  const value = platform.trim().toLowerCase();

  if (value.includes("instagram")) return "instagram";
  if (value.includes("facebook")) return "facebook";
  if (value.includes("twitter") || value.includes("x")) return "twitter";
  if (value.includes("youtube")) return "youtube";
  if (value.includes("tiktok")) return "tiktok";
  if (value.includes("threads")) return "threads";

  return value;
}

export const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return faInstagram;
  if (p.includes("facebook")) return faFacebook;
  if (p.includes("twitter") || p.includes("x.com")) return faXTwitter;
  if (p.includes("youtube")) return faYoutube;
  if (p.includes("tiktok")) return faTiktok;
  if (p.includes("threads")) return faThreads;
  if (p.includes("whatsapp")) return faWhatsapp;
  return faGlobe;
};

export function normalizeWhatsApp(list: unknown): string[] {
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

export function normalizeSocialMedia(socialMedia: unknown): SocialMedia[] {
  const normalizeItems = (items: SocialMedia[]): SocialMedia[] => {
    const seen = new Set<string>();

    return items
      .map((item) => ({
        platform: normalizeSocialPlatform(item?.platform || ""),
        url: item?.url?.trim?.() || "",
      }))
      .filter((item) => item.platform || item.url)
      .filter((item) => {
        if (!item.platform) return false;
        if (seen.has(item.platform)) return false;
        seen.add(item.platform);
        return true;
      });
  };

  if (!socialMedia) return [];
  if (Array.isArray(socialMedia)) return normalizeItems(socialMedia);
  if (typeof socialMedia === 'string') {
    try {
      const parsed = JSON.parse(socialMedia);
      return Array.isArray(parsed) ? normalizeItems(parsed) : [];
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
