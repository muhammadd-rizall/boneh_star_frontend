import { useEffect, useState, useCallback } from "react";
import { activityTypeService } from "../services/ActivityTypeService";
import type { ActivityType, ActivityTypeStatistics } from "../types/ActivityType";

export function useActivityTypes() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [statistics, setStatistics] = useState<ActivityTypeStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityTypes = useCallback(async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const { activityTypes, statistics } = await activityTypeService.getAll(search);
      setActivityTypes(activityTypes);
      setStatistics(statistics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch activity types";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteActivityType = async (id: string) => {
    try {
      if (!id) return;
      await activityTypeService.delete(id);
      await fetchActivityTypes();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete activity type";
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchActivityTypes();
  }, [fetchActivityTypes]);

  return {
    activityTypes,
    statistics,
    loading,
    error,
    refetch: fetchActivityTypes,
    deleteActivityType
  };
}

export function useTrashedActivityTypes() {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true);
      const data = await activityTypeService.getTrashed();
      setActivityTypes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trashed activity types";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const restoreActivityType = async (id: string) => {
    try {
      await activityTypeService.restore(id);
      await fetchTrashed();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore activity type";
      setError(errorMessage);
      throw err;
    }
  };

  const forceDeleteActivityType = async (id: string) => {
    try {
      await activityTypeService.forceDelete(id);
      await fetchTrashed();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to permanently delete activity type";
      setError(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchTrashed();
  }, [fetchTrashed]);

  return {
    activityTypes,
    loading,
    error,
    refetch: fetchTrashed,
    restoreActivityType,
    forceDeleteActivityType
  };
}
