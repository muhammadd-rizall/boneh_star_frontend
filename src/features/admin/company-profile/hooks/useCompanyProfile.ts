import { useEffect, useState, useCallback } from "react"
import { companyProfileService } from "@/features/admin/company-profile/services/CompanyProfileService"
import type { CompanyProfile, CompanyProfileFormData } from "@/features/admin/company-profile/types/CompanyProfile"

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await companyProfileService.getProfile()
      setProfile(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch company profile")
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = async (data: CompanyProfileFormData) => {
    try {
      setUpdating(true)
      setError(null)
      const updatedProfile = await companyProfileService.updateProfile(data)
      setProfile(updatedProfile)
      return updatedProfile
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to update company profile";
      setError(message)
      throw err;
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    updating,
    error,
    refetch: fetchProfile,
    updateProfile
  }
}
