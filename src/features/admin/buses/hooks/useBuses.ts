import { useEffect, useState, useCallback } from "react"
import { busService } from "@/features/admin/buses/services/BusService"
import type { Bus, BusStatistics } from "@/features/admin/buses/types/Bus"

export function useBuses() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [statistics, setStatistics] = useState<BusStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBuses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { buses, statistics } = await busService.getAll()
      setBuses(buses)
      setStatistics(statistics)
    } catch (err: any) {
      setError(err.message || "Failed to fetch buses")
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteBus = async (id: string) => {
    try {
      if (!id) return;
      await busService.delete(id)
      await fetchBuses()
    } catch (err: any) {
      setError(err.message || "Failed to delete bus")
    }
  }

  useEffect(() => {
    fetchBuses()
  }, [fetchBuses])

  return {
    buses,
    statistics,
    loading,
    error,
    refetch: fetchBuses,
    deleteBus
  }
}

export function useTrashedBuses() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await busService.getTrashed()
      setBuses(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch trashed buses")
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreBus = async (id: string) => {
    try {
      await busService.restore(id)
      await fetchTrashed()
    } catch (err: any) {
      setError(err.message || "Failed to restore bus")
    }
  }

  const forceDeleteBus = async (id: string) => {
    try {
      await busService.forceDelete(id)
      await fetchTrashed()
    } catch (err: any) {
      setError(err.message || "Failed to permanently delete bus")
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    buses,
    loading,
    error,
    refetch: fetchTrashed,
    restoreBus,
    forceDeleteBus
  }
}
