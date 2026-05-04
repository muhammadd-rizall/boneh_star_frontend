import { useEffect } from "react";
import { useCompanyStore } from "@/store/useCompanyStore";

/**
 * IMPLEMENTASI KONSEP: Dynamic Website Setting (Client-Side Cache)
 * Hook ini menggunakan Global Store (Zustand) agar data profil perusahaan
 * tetap sinkron di seluruh komponen dan tidak hilang saat navigasi.
 */
export function usePublicCompanyProfile() {
  const profile = useCompanyStore((state) => state.profile);
  const loading = useCompanyStore((state) => state.loading);
  const error = useCompanyStore((state) => state.error);
  const fetchProfile = useCompanyStore((state) => state.fetchProfile);

  useEffect(() => {
    // Ambil data dari server (hanya jika belum ada di store)
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: () => fetchProfile(true), // Fungsi manual untuk paksa update
  };
}
