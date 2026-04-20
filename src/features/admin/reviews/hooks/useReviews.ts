import { useEffect, useState, useCallback } from "react"
import { reviewService } from "@/features/admin/reviews/services/ReviewService"
import type { Review, ReviewStatistics } from "@/features/admin/reviews/types/Review"

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<any>(null)
  const [page, setPage] = useState(1)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { reviews, statistics, meta } = await reviewService.getPaginated({ page })
      setReviews(reviews)
      setStatistics(statistics)
      setMeta(meta)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch reviews";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [page])

  const togglePublishReview = async (id: string) => {
    try {
      await reviewService.togglePublish(id)
      await fetchReviews()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle publish status";
      setError(errorMessage)
      throw err;
    }
  }

  const deleteReview = async (id: string) => {
    try {
      await reviewService.delete(id)
      await fetchReviews()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete review";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return {
    reviews,
    statistics,
    loading,
    error,
    meta,
    page,
    setPage,
    refetch: fetchReviews,
    togglePublishReview,
    deleteReview
  }
}

export function useTrashedReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await reviewService.getTrashed()
      setReviews(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trashed reviews";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreReview = async (id: string) => {
    try {
      await reviewService.restore(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore review";
      setError(errorMessage)
      throw err;
    }
  }

  const forceDeleteReview = async (id: string) => {
    try {
      await reviewService.forceDelete(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to permanently delete review";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    reviews,
    loading,
    error,
    refetch: fetchTrashed,
    restoreReview,
    forceDeleteReview
  }
}
