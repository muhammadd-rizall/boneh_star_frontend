import { useEffect, useState, useCallback } from "react"
import { transactionService } from "@/features/admin/transactions/services/TransactionService"
import type { Transaction, TransactionStatistics } from "@/features/admin/transactions/types/Transaction"

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [trashedTransactions, setTrashedTransactions] = useState<Transaction[]>([])
  const [statistics, setStatistics] = useState<TransactionStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { transactions, statistics } = await transactionService.getAll()
      setTransactions(transactions)
      setStatistics(statistics)
    } catch (err: any) {
      setError(err.message || "Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await transactionService.getTrashed()
      setTrashedTransactions(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch trashed transactions")
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteTransaction = async (id: string) => {
    try {
      await transactionService.delete(id)
      await fetchTransactions()
    } catch (err: any) {
      setError(err.message || "Failed to delete transaction")
      throw err
    }
  }

  const restoreTransaction = async (id: string) => {
    try {
      await transactionService.restore(id)
      await fetchTrashed()
      await fetchTransactions()
    } catch (err: any) {
      setError(err.message || "Failed to restore transaction")
      throw err
    }
  }

  const forceDeleteTransaction = async (id: string) => {
    try {
      await transactionService.forceDelete(id)
      await fetchTrashed()
    } catch (err: any) {
      setError(err.message || "Failed to permanently delete transaction")
      throw err
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    trashedTransactions,
    statistics,
    loading,
    error,
    refetch: fetchTransactions,
    fetchTrashed,
    deleteTransaction,
    restoreTransaction,
    forceDeleteTransaction
  }
}
