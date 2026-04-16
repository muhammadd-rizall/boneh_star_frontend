import { useEffect, useState, useCallback } from "react"
import { driverService } from "@/features/admin/drivers/services/DriverService"
import type { Driver, DriverStatistics } from "@/features/admin/drivers/types/Driver"

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [statistics, setStatistics] = useState<DriverStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { drivers, statistics } = await driverService.getAll()
      setDrivers(drivers)
      setStatistics(statistics)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch drivers";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteDriver = async (id: string) => {
    try {
      if (!id) return;
      await driverService.delete(id)
      await fetchDrivers()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete driver";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [fetchDrivers])

  return {
    drivers,
    statistics,
    loading,
    error,
    refetch: fetchDrivers,
    deleteDriver
  }
}

export function useTrashedDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await driverService.getTrashed()
      setDrivers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trashed drivers";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreDriver = async (id: string) => {
    try {
      await driverService.restore(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore driver";
      setError(errorMessage)
      throw err;
    }
  }

  const forceDeleteDriver = async (id: string) => {
    try {
      await driverService.forceDelete(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to permanently delete driver";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    drivers,
    loading,
    error,
    refetch: fetchTrashed,
    restoreDriver,
    forceDeleteDriver
  }
}
