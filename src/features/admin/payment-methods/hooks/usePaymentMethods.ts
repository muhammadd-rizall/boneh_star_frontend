import { useEffect, useState, useCallback } from "react"
import { paymentMethodService } from "@/features/admin/payment-methods/services/PaymentMethodService"
import type { PaymentMethod, PaymentMethodStatistics } from "@/features/admin/payment-methods/types/PaymentMethod"

export function usePaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [statistics, setStatistics] = useState<PaymentMethodStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchPaymentMethods = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { paymentMethods, statistics } = await paymentMethodService.getAll(searchTerm || undefined)
      setPaymentMethods(paymentMethods)
      setStatistics(statistics)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch payment methods";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  const deletePaymentMethod = async (id: string) => {
    try {
      if (!id) return;
      await paymentMethodService.delete(id)
      await fetchPaymentMethods()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete payment method";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPaymentMethods()
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchPaymentMethods])

  return {
    paymentMethods,
    statistics,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refetch: fetchPaymentMethods,
    deletePaymentMethod
  }
}

export function useTrashedPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await paymentMethodService.getTrashed()
      setPaymentMethods(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch trashed payment methods";
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const restorePaymentMethod = async (id: string) => {
    try {
      await paymentMethodService.restore(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to restore payment method";
      setError(errorMessage)
      throw err;
    }
  }

  const forceDeletePaymentMethod = async (id: string) => {
    try {
      await paymentMethodService.forceDelete(id)
      await fetchTrashed()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to permanently delete payment method";
      setError(errorMessage)
      throw err;
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    paymentMethods,
    loading,
    error,
    refetch: fetchTrashed,
    restorePaymentMethod,
    forceDeletePaymentMethod
  }
}
