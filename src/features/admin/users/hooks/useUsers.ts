import { useEffect, useState, useCallback } from "react"
import { userService } from "@/features/admin/users/services/UserService"
import type { User, UserStatistics } from "@/features/admin/users/types/User"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [statistics, setStatistics] = useState<UserStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { users, statistics } = await userService.getAll()
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
