import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CompanyProfile } from '@/features/admin/company-profile/types/CompanyProfile';
import { companyProfileService } from '@/features/admin/company-profile/services/CompanyProfileService';
import { defaultCompanyProfile } from '@/features/admin/company-profile/utils/companyProfileUtils';

interface CompanyState {
  profile: CompanyProfile;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchProfile: (force?: boolean) => Promise<void>;
  updateProfileState: (newProfile: CompanyProfile) => void;
  setCompanyError: (message: string | null) => void;
}

export const useCompanyStore = create<CompanyState>()(
  persist(
    (set, get) => ({
      profile: defaultCompanyProfile,
      loading: false,
      error: null,
      hasFetched: false,
      setCompanyError: (message) => set({ error: message }),

      fetchProfile: async (force = false) => {
        // Jika sudah pernah fetch dan tidak dipaksa, gunakan data yang ada (Persistence)
        if (get().hasFetched && !force) return;

        set({ loading: true, error: null });
        try {
          const data = await companyProfileService.getProfile();
          if (data && data.company_name) {
            set({ profile: data, error: null, hasFetched: true });
          } else {
            set({ error: 'Profil perusahaan tidak ditemukan.' });
          }
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : 'Gagal mengambil profil perusahaan.';
          console.error("Store: Failed to fetch profile.", err);
          set({ error: message });
        } finally {
          set({ loading: false });
        }
      },

      updateProfileState: (newProfile: CompanyProfile) => {
        set({ profile: newProfile, hasFetched: true, error: null });
      },
    }),
    {
      name: 'company-profile-storage',
      // Pastikan data ini tidak hilang saat logout (Single Source of Truth)
    }
  )
);
