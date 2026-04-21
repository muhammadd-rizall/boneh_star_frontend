import { useEffect, useState, useCallback } from "react"
import { userService } from "@/features/admin/users/services/UserService"
import type { User, UserStatistics } from "@/features/admin/users/types/User"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { users, statistics } = await userService.getAll(search)
      setUsers(users)
      setStatistics(statistics)
    } catch (err: any) {
      setError(err.message || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = async (id: string) => {
    try {
      if (!id) return;
      await userService.delete(id)
      await fetchUsers()
    } catch (err: any) {
      setError(err.message || "Failed to delete user")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return {
    users,
    statistics,
    loading,
    error,
    refetch: fetchUsers,
    deleteUser
  }
}

export function useTrashedUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await userService.getTrashed()
      setUsers(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch trashed users")
    } finally {
      setLoading(false)
    }
  }, [])

  const restoreUser = async (id: string) => {
    try {
      await userService.restore(id)
      await fetchTrashed()
    } catch (err: any) {
      setError(err.message || "Failed to restore user")
    }
  }

  const forceDeleteUser = async (id: string) => {
    try {
      await userService.forceDelete(id)
      await fetchTrashed()
    } catch (err: any) {
      setError(err.message || "Failed to permanently delete user")
    }
  }

  useEffect(() => {
    fetchTrashed()
  }, [fetchTrashed])

  return {
    users,
    loading,
    error,
    refetch: fetchTrashed,
    restoreUser,
    forceDeleteUser
  }
}
