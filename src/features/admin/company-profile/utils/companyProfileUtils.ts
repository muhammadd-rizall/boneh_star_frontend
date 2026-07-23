import type { CompanyProfile, SocialMedia } from "@/features/admin/company-profile/types/CompanyProfile";
import Instagram from "@thesvg/react/instagram";
import Facebook from "@thesvg/react/facebook";
import Youtube from "@thesvg/react/youtube";
import Tiktok from "@thesvg/react/tiktok";
import Threads from "@thesvg/react/threads";
import Whatsapp from "@thesvg/react/whatsapp";
import X from "@thesvg/react/x";
import { Globe } from "lucide-react";

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
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "facebook", label: "Facebook", icon: Facebook },
  { id: "twitter", label: "Twitter / X", icon: X },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "tiktok", label: "TikTok", icon: Tiktok },
  { id: "threads", label: "Threads", icon: Threads },
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
  if (p.includes("instagram")) return Instagram;
  if (p.includes("facebook")) return Facebook;
  if (p.includes("twitter") || p.includes("x.com")) return X;
  if (p.includes("youtube")) return Youtube;
  if (p.includes("tiktok")) return Tiktok;
  if (p.includes("threads")) return Threads;
  if (p.includes("whatsapp")) return Whatsapp;
  return Globe;
};

export function normalizeWhatsApp(list: unknown): string[] {
  if (!list) return [];
  if (Array.isArray(list)) {
    return list.map(item => {
      if (typeof item === 'object' && item !== null && 'number' in item) {
        return String((item as any).number);
      }
      return String(item);
    });
  }
  if (typeof list === 'string') {
    try {
      const parsed = JSON.parse(list);
      return Array.isArray(parsed) 
        ? parsed.map(item => typeof item === 'object' && item !== null && 'number' in item ? String((item as any).number) : String(item))
        : [list];
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

  // Filter out dead placeholder domains immediately to avoid 30s network timeout delay
  if (
    path.includes("via.placeholder.com") ||
    path.includes("lorempixel.com") ||
    path.includes("placeholder.com") ||
    path.includes("picsum.photos")
  ) {
    return "";
  }

  // Jika sudah berupa URL (http/https), gunakan langsung
  if (path.startsWith("http")) return path;
  
  // Fallback jika backend mengirim path relatif (cadangan)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
  const baseUrl = apiBaseUrl.replace(/\/api$/, "");
  return `${baseUrl}/storage/${path.replace(/^\//, "")}`;
}

export function buildWhatsAppHref(whatsapp: string, message?: string): string {
  if (!whatsapp) return "#";
  const cleanNumber = String(whatsapp).replace(/\D/g, "");
  if (!cleanNumber) return "#";
  const formattedNumber = cleanNumber.startsWith("0") 
    ? "62" + cleanNumber.slice(1) 
    : cleanNumber.startsWith("62") ? cleanNumber : "62" + cleanNumber;
  
  if (message) {
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
  }
  return `https://wa.me/${formattedNumber}`;
}
