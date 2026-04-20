import { useEffect, useState, useCallback } from "react"
import { paymentService } from "@/features/admin/payments/services/PaymentService"
import type { Payment, PaymentStatistics, PaymentVerifyData } from "@/features/admin/payments/types/Payment"

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [statistics, setStatistics] = useState<PaymentStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<any>(null)
  const [page, setPage] = useState(1)

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { payments, statistics, meta } = await paymentService.getPaginated({ page })
      setPayments(payments)
      setStatistics(statistics)
      setMeta(meta)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch payments";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [page])

  const verifyPayment = async (id: string, data: PaymentVerifyData) => {
    try {
      await paymentService.verify(id, data)
      await fetchPayments()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to verify payment";
      setError(errorMessage)
      throw err;
    }
  }

  const deletePayment = async (id: string) => {
    try {
      await paymentService.delete(id)
      await fetchPayments()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete payment";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  return {
    payments,
    statistics,
    loading,
    error,
    meta,
    page,
    setPage,
    refetch: fetchPayments,
    verifyPayment,
    deletePayment
  }
}

export function useTrashedPayments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await paymentService.getTrashed()
      setPayments(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trashed payments";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const restorePayment = async (id: string) => {
    try {
      await paymentService.restore(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore payment";
      setError(errorMessage)
      throw err;
    }
  }

  const forceDeletePayment = async (id: string) => {
    try {
      await paymentService.forceDelete(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to permanently delete payment";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    payments,
    loading,
    error,
    refetch: fetchTrashed,
    restorePayment,
    forceDeletePayment
  }
}
