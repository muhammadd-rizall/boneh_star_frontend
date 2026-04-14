import { useEffect, useState, useCallback } from "react"
import { customerService } from "@/features/admin/customers/services/CustomerService"
import type { Customer, CustomerStatistics } from "@/features/admin/customers/types/Customer"

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [statistics, setStatistics] = useState<CustomerStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { customers, statistics } = await customerService.getAll()
      setCustomers(customers)
      setStatistics(statistics)
    } catch (err: any) {
      setError(err.message || "Failed to fetch customers")
    } finally {
      setLoading(false)
    }
  }, [])

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
  }, [fetchCustomers])

  return {
    customers,
    statistics,
    loading,
    error,
    refetch: fetchCustomers,
    deleteCustomer
  }
}
