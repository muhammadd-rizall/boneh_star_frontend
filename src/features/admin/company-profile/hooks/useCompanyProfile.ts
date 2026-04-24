import { useEffect, useCallback } from "react"
import { useCompanyStore } from "@/store/useCompanyStore"
import { companyProfileService } from "@/features/admin/company-profile/services/CompanyProfileService"
import type { CompanyProfile, CompanyProfileFormData } from "@/features/admin/company-profile/types/CompanyProfile"
import { normalizeWhatsApp, normalizeSocialMedia } from "../utils/companyProfileUtils"

export function useCompanyProfile() {
  const { profile, loading, error, fetchProfile, updateProfileState, setCompanyError } = useCompanyStore();

  const updateProfile = async (data: CompanyProfileFormData) => {
    try {
      setCompanyError(null);
      const updatedProfile = await companyProfileService.updateProfile(data)
      // Perbarui global state agar footer/header langsung berubah
      updateProfileState(updatedProfile)
      return updatedProfile
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update company profile";
      setCompanyError(message);
      throw new Error(message);
    }
  }

  const mapToFormData = useCallback((profile: CompanyProfile): CompanyProfileFormData => {
    return {
      company_name: profile.company_name || "",
      address: profile.address || "",
      whatsapp: normalizeWhatsApp(profile.whatsapp).length > 0 ? normalizeWhatsApp(profile.whatsapp) : [""],
      social_media: normalizeSocialMedia(profile.social_media),
      email: profile.email || "",
      description: profile.description || "",
      logo: null,
      remove_logo: false,
    };
  }, []);

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    error,
    refetch: () => fetchProfile(true),
    updateProfile,
    mapToFormData
  }
}
