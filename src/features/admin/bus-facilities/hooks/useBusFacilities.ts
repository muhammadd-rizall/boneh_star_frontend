import { useEffect, useState, useCallback } from "react"
import { busFacilityService } from "@/features/admin/bus-facilities/services/BusFacilityService"
import type { BusFacility, BusFacilityStatistics } from "@/features/admin/bus-facilities/types/BusFacility"

export function useBusFacilities() {
  const [facilities, setFacilities] = useState<BusFacility[]>([])
  const [statistics, setStatistics] = useState<BusFacilityStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFacilities = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { facilities, statistics } = await busFacilityService.getAll(search)
      setFacilities(facilities)
      setStatistics(statistics)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch bus facilities";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteFacility = async (id: string) => {
    try {
      if (!id) return;
      await busFacilityService.delete(id)
      await fetchFacilities()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete facility";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchFacilities()
  }, [fetchFacilities])

  return {
    facilities,
    statistics,
    loading,
    error,
    refetch: fetchFacilities,
    deleteFacility
  }
}

export function useTrashedBusFacilities() {
  const [facilities, setFacilities] = useState<BusFacility[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await busFacilityService.getTrashed()
      setFacilities(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trashed facilities";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreFacility = async (id: string) => {
    try {
      await busFacilityService.restore(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore facility";
      setError(errorMessage)
      throw err;
    }
  }

  const forceDeleteFacility = async (id: string) => {
    try {
      await busFacilityService.forceDelete(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to permanently delete facility";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    facilities,
    loading,
    error,
    refetch: fetchTrashed,
    restoreFacility,
    forceDeleteFacility
  }
}
