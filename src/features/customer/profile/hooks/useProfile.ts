import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/ProfileService';
import type { CustomerProfile, UpdateProfileData, BookingStatistics } from '../types/Profile';

export function useProfile() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [statistics, setStatistics] = useState<BookingStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    }
  }, []);

  const fetchStatistics = useCallback(async () => {
    try {
      const data = await profileService.getStatistics();
      setStatistics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch statistics');
    }
  }, []);

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const updated = await profileService.updateProfile(data);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const uploadPicture = async (file: File) => {
    try {
      const updated = await profileService.uploadPicture(file);
      setProfile(updated);
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const updatePassword = async (data: any) => {
    try {
      await profileService.updatePassword(data);
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchStatistics()]);
      setLoading(false);
    };
    init();
  }, [fetchProfile, fetchStatistics]);

  return {
    profile,
    statistics,
    loading,
    error,
    updateProfile,
    updatePassword,
    uploadPicture,
    refresh: () => {
      fetchProfile();
      fetchStatistics();
    },
  };
}
