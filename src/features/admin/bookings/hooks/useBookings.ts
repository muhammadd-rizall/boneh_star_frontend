import { useEffect, useState, useCallback } from "react"
import { bookingService } from "@/features/admin/bookings/services/BookingService"
import type { Booking, BookingStatistics } from "@/features/admin/bookings/types/Booking"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [trashedBookings, setTrashedBookings] = useState<Booking[]>([])
  const [statistics, setStatistics] = useState<BookingStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)
      const { bookings, statistics } = await bookingService.getAll(search)
      setBookings(bookings)
      setStatistics(statistics)
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrashed = useCallback(async () => {
    try {
      setLoading(true)
      const data = await bookingService.getTrashed()
      setTrashedBookings(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch trashed bookings")
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteBooking = async (id: string) => {
    try {
      await bookingService.delete(id)
      await fetchBookings()
    } catch (err: any) {
      setError(err.message || "Failed to delete booking")
      throw err
    }
  }

  const restoreBooking = async (id: string) => {
    try {
      await bookingService.restore(id)
      await fetchTrashed()
      await fetchBookings()
    } catch (err: any) {
      setError(err.message || "Failed to restore booking")
      throw err
    }
  }

  const forceDeleteBooking = async (id: string) => {
    try {
      await bookingService.forceDelete(id)
      await fetchTrashed()
    } catch (err: any) {
      setError(err.message || "Failed to permanently delete booking")
      throw err
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  return {
    bookings,
    trashedBookings,
    statistics,
    loading,
    error,
    refetch: fetchBookings,
    fetchTrashed,
    deleteBooking,
    restoreBooking,
    forceDeleteBooking
  }
}
