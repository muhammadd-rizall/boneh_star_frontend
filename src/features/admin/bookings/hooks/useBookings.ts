import { useEffect, useState, useCallback } from "react"
import { bookingService } from "@/features/admin/bookings/services/BookingService"
import type { Booking, BookingStatistics } from "@/features/admin/bookings/types/Booking"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statistics, setStatistics] = useState<BookingStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { bookings, statistics } = await bookingService.getAll()
      setBookings(bookings)
      setStatistics(statistics)
    } catch (err: any) {
      setError(err.message || "Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteBooking = async (id: string) => {
    try {
      if (!id) return;
      await bookingService.delete(id)
      await fetchBookings()
    } catch (err: any) {
      setError(err.message || "Failed to delete booking")
      throw err
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  return {
    bookings,
    statistics,
    loading,
    error,
    refetch: fetchBookings,
    deleteBooking
  }
}
