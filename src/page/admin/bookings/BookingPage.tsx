import { useState, useMemo, useEffect } from "react"
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
  Users,
  Bus,
  Trash2,
  List
} from "lucide-react"

export default function BookingPage() {
  const { 
    bookings, 
    trashedBookings,
    statistics, 
    loading, 
    error, 
    deleteBooking, 
    restoreBooking, 
    forceDeleteBooking,
    refetch,
    fetchTrashed 
  } = useBookings()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [bookingToManage, setBookingToManage] = useState<Booking | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [view, setView] = useState<'active' | 'trashed'>('active')

  useEffect(() => {
    if (view === 'trashed') {
      fetchTrashed()
    } else {
      const timeoutId = setTimeout(() => {
        refetch(searchTerm)
      }, 500)
      return () => clearTimeout(timeoutId)
    }
  }, [view, searchTerm, fetchTrashed, refetch])

  const currentData = view === 'active' ? bookings : trashedBookings

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
    setBookingToManage(booking)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!bookingToManage) return
    setActionLoading(true)
    try {
      await deleteBooking(bookingToManage.id)
      setIsConfirmOpen(false)
      setBookingToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestoreClick = (booking: Booking) => {
    setBookingToManage(booking)
    setIsRestoreConfirmOpen(true)
  }

  const handleConfirmRestore = async () => {
    if (!bookingToManage) return
    setActionLoading(true)
    try {
      await restoreBooking(bookingToManage.id)
      setIsRestoreConfirmOpen(false)
      setBookingToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceDeleteClick = (booking: Booking) => {
    setBookingToManage(booking)
    setIsForceDeleteConfirmOpen(true)
  }

  const handleConfirmForceDelete = async () => {
    if (!bookingToManage) return
    setActionLoading(true)
    try {
      await forceDeleteBooking(bookingToManage.id)
      setIsForceDeleteConfirmOpen(false)
      setBookingToManage(null)
    } finally {
      setActionLoading(false)
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
            <Button variant="outline" icon={RefreshCcw} onClick={view === 'active' ? refetch : fetchTrashed} loading={loading}>
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

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setView('active')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${view === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={14} />
              Active
            </button>
            <button
              onClick={() => setView('trashed')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${view === 'trashed' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Trash2 size={14} />
              Trash
            </button>
          </div>
        </div>
      </section>

      <div className="min-h-[400px]">
        {error ? (
          <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-12 text-center shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="mx-auto inline-flex max-w-md flex-col items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-6 text-left text-rose-700">
              <ShieldAlert size={36} />
              <div className="space-y-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Operation Error</span>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={view === 'active' ? refetch : fetchTrashed}>Try Again</Button>
            </div>
          </div>
        ) : (
          <BookingTable 
            data={currentData} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit}
            onRestore={handleRestoreClick}
            onForceDelete={handleForceDeleteClick}
            loading={loading} 
            isTrashed={view === 'trashed'}
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
        loading={actionLoading}
        title="Move to Trash"
        message={`Are you sure you want to move booking ${bookingToManage?.booking_code} to trash?`}
      />

      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={handleConfirmRestore}
        loading={actionLoading}
        title="Restore Booking"
        message={`Are you sure you want to restore booking ${bookingToManage?.booking_code}?`}
      />

      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={handleConfirmForceDelete}
        loading={actionLoading}
        variant="danger"
        title="Permanently Delete"
        message={`WARNING: Are you sure you want to permanently delete booking ${bookingToManage?.booking_code}? This action cannot be undone.`}
      />
    </div>
  )
}
