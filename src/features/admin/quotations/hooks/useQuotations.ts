import { useEffect, useState, useCallback } from "react"
import { quotationService } from "@/features/admin/quotations/services/QuotationService"
import type { Quotation, QuotationStatistics } from "@/features/admin/quotations/types/Quotation"

export function useQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [statistics, setStatistics] = useState<QuotationStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuotations = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { quotations, statistics } = await quotationService.getAll(search)
      setQuotations(quotations)
      setStatistics(statistics)
    } catch (err: any) {
      setError(err.message || "Failed to fetch quotations")
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteQuotation = async (id: string) => {
    try {
      if (!id) return;
      await quotationService.delete(id)
      await fetchQuotations()
    } catch (err: any) {
      setError(err.message || "Failed to delete quotation")
      throw err
    }
  }

  useEffect(() => {
    fetchQuotations()
  }, [fetchQuotations])

  return {
    quotations,
    statistics,
    loading,
    error,
    refetch: fetchQuotations,
    deleteQuotation
  }
}
