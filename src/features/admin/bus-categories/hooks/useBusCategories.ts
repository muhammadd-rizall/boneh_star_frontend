import { useEffect, useState, useCallback } from "react"
import { busCategoryService } from "@/features/admin/bus-categories/services/BusCategoryService"
import type { BusCategory, BusCategoryStatistics } from "@/features/admin/bus-categories/types/BusCategory"

export function useBusCategories() {
  const [categories, setCategories] = useState<BusCategory[]>([])
  const [statistics, setStatistics] = useState<BusCategoryStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { categories, statistics } = await busCategoryService.getAll()
      setCategories(categories)
      setStatistics(statistics)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch bus categories";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCategory = async (id: string) => {
    try {
      if (!id) return;
      await busCategoryService.delete(id)
      await fetchCategories()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete category";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    statistics,
    loading,
    error,
    refetch: fetchCategories,
    deleteCategory
  }
}

export function useTrashedBusCategories() {
  const [categories, setCategories] = useState<BusCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await busCategoryService.getTrashed()
      setCategories(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trashed categories";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreCategory = async (id: string) => {
    try {
      await busCategoryService.restore(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore category";
      setError(errorMessage)
      throw err;
    }
  }

  const forceDeleteCategory = async (id: string) => {
    try {
      await busCategoryService.forceDelete(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to permanently delete category";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    categories,
    loading,
    error,
    refetch: fetchTrashed,
    restoreCategory,
    forceDeleteCategory
  }
}
