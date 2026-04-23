import { useEffect, useState, useCallback } from "react"
import { reviewService } from "@/features/admin/reviews/services/ReviewService"
import type { ReviewReportData, ReviewQueryParams } from "@/features/admin/reviews/types/Review"

export function useReviews(initialParams: ReviewQueryParams = {}) {
  const [report, setReport] = useState<ReviewReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useState<ReviewQueryParams>({
    page: 1,
    per_page: 15,
    ...initialParams
  })

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await reviewService.getReport(params)
      setReport(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch review report";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [params])

  const togglePublishReview = async (id: string) => {
    try {
      await reviewService.togglePublish(id)
      await fetchReport()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to toggle publish status";
      setError(errorMessage)
      throw err;
    }
  }

  const deleteReview = async (id: string) => {
    try {
      await reviewService.delete(id)
      await fetchReport()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete review";
      setError(errorMessage)
      throw err;
    }
  }

  const updateParams = (newParams: Partial<ReviewQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: newParams.page ?? 1 }))
  }

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  return {
    report,
    loading,
    error,
    params,
    updateParams,
    refetch: fetchReport,
    togglePublishReview,
    deleteReview
  }
}
