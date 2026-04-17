import { useState, useMemo } from "react"
import { 
  BookingTable, 
  BookingForm, 
  useBookings,
  type Booking 
} from "@/features/admin/bookings"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Search from "@/components/ui/Search"
import Confirmation from "@/components/feedback/Confirmation"
import { 
  Plus, 
  RefreshCcw, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ShieldAlert,
  Calendar,
  Users,
  Bus
} from "lucide-react"

export default function BookingPage() {
  const { bookings, statistics, loading, error, deleteBooking, refetch } = useBookings()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => 
      booking.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.origin.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [bookings, searchTerm])

  const handleCreate = () => {
    setSelectedBooking(null)
    setIsModalOpen(true)
  }

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    refetch()
  }

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!bookingToDelete) return
    setDeleteLoading(true)
    try {
      await deleteBooking(bookingToDelete.id)
      setIsConfirmOpen(false)
      setBookingToDelete(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const stats = [
    { label: "Total Bookings", value: statistics?.total_bookings ?? 0, icon: FileText, note: "All registered bookings" },
    { label: "Confirmed", value: statistics?.by_status.confirmed ?? 0, icon: CheckCircle, note: "Ready for departure" },
    { label: "Pending", value: statistics?.by_status.pending ?? 0, icon: Clock, note: "Needs review" },
    { label: "Cancelled", value: statistics?.by_status.cancelled ?? 0, icon: XCircle, note: "Cancelled bookings" },
  ]

  const overview = [
    { label: "Total Passengers", value: statistics?.total_passengers ?? 0, icon: Users },
    { label: "Buses Requested", value: statistics?.total_buses_requested ?? 0, icon: Bus },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin management</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Bookings Management</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search by code, customer, or origin..." 
            />
            <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create Booking
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 border-b border-slate-100 pb-6">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                  <stat.icon size={20} />
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live</span>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {loading ? "..." : stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-8">
          {overview.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                <item.icon size={16} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{item.label}</p>
                <p className="text-lg font-bold text-slate-700">{loading ? "..." : item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="min-h-[400px]">
        {error ? (
          <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-12 text-center shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="mx-auto inline-flex max-w-md flex-col items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-6 text-left text-rose-700">
              <ShieldAlert size={36} />
              <div className="space-y-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Authorization Required</span>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={refetch}>Try Again</Button>
            </div>
          </div>
        ) : (
          <BookingTable 
            data={filteredBookings} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit}
            loading={loading} 
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedBooking ? "Update Booking Details" : "Create New Booking"} size="xl">
        <BookingForm booking={selectedBooking} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Confirm Deletion"
        message={`Are you sure you want to delete booking ${bookingToDelete?.booking_code}? This action will move it to trash.`}
      />
    </div>
  )
}
