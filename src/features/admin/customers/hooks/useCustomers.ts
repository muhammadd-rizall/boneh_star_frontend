import { useEffect, useState, useCallback, useRef } from "react"
import { customerService } from "@/features/admin/customers/services/CustomerService"
import type { Customer, CustomerStatistics } from "@/features/admin/customers/types/Customer"

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [statistics, setStatistics] = useState<CustomerStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchCustomers = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { customers, statistics } = await customerService.getAll(search)
      setCustomers(customers)
      setStatistics(statistics)
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers")
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search — hanya kirim request 350ms setelah user berhenti mengetik
  const searchCustomers = useCallback((search?: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchCustomers(search)
    }, 350)
  }, [fetchCustomers])

  const deleteCustomer = async (id: string) => {
    try {
      if (!id) return;
      await customerService.delete(id)
      await fetchCustomers()
    } catch (err: any) {
      setError(err.message || "Failed to delete customer")
    }
  }

  useEffect(() => {
    fetchCustomers()
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [fetchCustomers])

  return {
    customers,
    statistics,
    loading,
    error,
    refetch: fetchCustomers,
    searchCustomers,
    deleteCustomer
  }
}


export function useTrashedCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await customerService.getTrashed()
      setCustomers(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch trashed customers")
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreCustomer = async (id: string) => {
    try {
      await customerService.restore(id)
      await fetchTrashed()
    } catch (err: any) {
      setError(err.message || "Failed to restore customer")
    }
  }

  const forceDeleteCustomer = async (id: string) => {
    try {
      await customerService.forceDelete(id)
      await fetchTrashed()
    } catch (err: any) {
      setError(err.message || "Failed to permanently delete customer")
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    customers,
    loading,
    error,
    refetch: fetchTrashed,
    restoreCustomer,
    forceDeleteCustomer
  }
}
