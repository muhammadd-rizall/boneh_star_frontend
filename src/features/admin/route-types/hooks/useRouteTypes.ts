import { useEffect, useState, useCallback } from "react"
import { routeTypeService } from "@/features/admin/route-types/services/RouteTypeService"
import type { RouteType, RouteTypeStatistics } from "@/features/admin/route-types/types/RouteType"

export function useRouteTypes() {
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([])
  const [statistics, setStatistics] = useState<RouteTypeStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRouteTypes = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { routeTypes, statistics } = await routeTypeService.getAll(search)
      setRouteTypes(routeTypes)
      setStatistics(statistics)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch route types";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRouteType = async (id: string) => {
    try {
      if (!id) return;
      await routeTypeService.delete(id)
      await fetchRouteTypes()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete route type";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchRouteTypes()
  }, [fetchRouteTypes])

  return {
    routeTypes,
    statistics,
    loading,
    error,
    refetch: fetchRouteTypes,
    deleteRouteType
  }
}

export function useTrashedRouteTypes() {
  const [routeTypes, setRouteTypes] = useState<RouteType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await routeTypeService.getTrashed()
      setRouteTypes(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trashed route types";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreRouteType = async (id: string) => {
    try {
      await routeTypeService.restore(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore route type";
      setError(errorMessage)
      throw err;
    }
  }

  const forceDeleteRouteType = async (id: string) => {
    try {
      await routeTypeService.forceDelete(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to permanently delete route type";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    routeTypes,
    loading,
    error,
    refetch: fetchTrashed,
    restoreRouteType,
    forceDeleteRouteType
  }
}
