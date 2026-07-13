import Confirmation from "@/components/feedback/Confirmation"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import {
    ErrorBanner,
    PageHeader,
    PageToolbar,
    StatCard, StatGrid,
    ViewToggle,
} from "@/components/ui/PageComponents"
import {
    BookingForm,
    BookingTable,
    useBookings,
    type Booking,
} from "@/features/admin/bookings"
import { useToastStore } from "@/store/useToastStore"
import {
    Bus,
    CheckCircle2,
    Clock,
    FileText,
    Plus,
    RefreshCcw,
    Users,
    XCircle,
} from "lucide-react"
import { useEffect, useState } from "react"

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
    fetchTrashed,
  } = useBookings()

  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"active" | "trash">("active")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [bookingToManage, setBookingToManage] = useState<Booking | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const showSuccess = useToastStore(state => state.showSuccess)

  useEffect(() => {
    if (view === "trash") {
      fetchTrashed()
    } else {
      const id = setTimeout(() => refetch(searchTerm), 500)
      return () => clearTimeout(id)
    }
  }, [view, searchTerm, fetchTrashed, refetch])

  const currentData = view === "active" ? bookings : trashedBookings

  const handleCreate = () => { setSelectedBooking(null); setIsModalOpen(true) }
  const handleEdit = (b: Booking) => { setSelectedBooking(b); setIsModalOpen(true) }
  const handleSuccess = () => { 
    setIsModalOpen(false); 
    refetch();
    showSuccess(selectedBooking ? "Booking berhasil diperbarui!" : "Booking baru berhasil dibuat!");
  }

  const handleDeleteClick = (b: Booking) => { setBookingToManage(b); setIsConfirmOpen(true) }
  const handleConfirmDelete = async () => {
    if (!bookingToManage) return
    setActionLoading(true)
    try { 
      await deleteBooking(bookingToManage.id); 
      setIsConfirmOpen(false); 
      showSuccess(`Booking "${bookingToManage.booking_code}" dipindahkan ke sampah.`);
      setBookingToManage(null);
    }
    finally { setActionLoading(false) }
  }

  const handleRestoreClick = (b: Booking) => { setBookingToManage(b); setIsRestoreConfirmOpen(true) }
  const handleConfirmRestore = async () => {
    if (!bookingToManage) return
    setActionLoading(true)
    try { 
      await restoreBooking(bookingToManage.id); 
      setIsRestoreConfirmOpen(false); 
      showSuccess(`Booking "${bookingToManage.booking_code}" berhasil dipulihkan.`);
      setBookingToManage(null);
    }
    finally { setActionLoading(false) }
  }

  const handleForceDeleteClick = (b: Booking) => { setBookingToManage(b); setIsForceDeleteConfirmOpen(true) }
  const handleConfirmForceDelete = async () => {
    if (!bookingToManage) return
    setActionLoading(true)
    try { 
      await forceDeleteBooking(bookingToManage.id); 
      setIsForceDeleteConfirmOpen(false); 
      showSuccess(`Booking "${bookingToManage.booking_code}" berhasil dihapus permanen.`);
      setBookingToManage(null);
    }
    finally { setActionLoading(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Manajemen Pemesanan"
        subtitle="Kelola seluruh data booking armada bus"
        badge="Pemesanan"
        actions={
          <PageToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari kode, pelanggan, atau asal..."
            onCreate={handleCreate}
            createLabel="Buat Booking"
            createIcon={Plus}
            extraActions={
              <Button
                variant="outline"
                icon={RefreshCcw}
                className="h-11 rounded-xl px-5"
                onClick={view === "active" ? () => refetch(searchTerm) : fetchTrashed}
                loading={loading}
              >
                Refresh
              </Button>
            }
          />
        }
      />

      {/* ── Stats ── */}
      <StatGrid columns={4}>
        <StatCard label="Total Booking" value={statistics?.total_bookings ?? 0} icon={FileText} loading={loading} color="default" />
        <StatCard label="Dikonfirmasi" value={statistics?.by_status.confirmed ?? 0} icon={CheckCircle2} loading={loading} color="emerald" />
        <StatCard label="Menunggu" value={statistics?.by_status.pending ?? 0} icon={Clock} loading={loading} color="amber" />
        <StatCard label="Dibatalkan" value={statistics?.by_status.cancelled ?? 0} icon={XCircle} loading={loading} color="rose" />
      </StatGrid>

      {/* ── Overview row ── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-5">
          {[
            { label: "Total Penumpang", value: statistics?.total_passengers ?? 0, icon: Users },
            { label: "Bus Diminta", value: statistics?.total_buses_requested ?? 0, icon: Bus },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <item.icon size={15} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">{item.label}</p>
                <p className="text-sm font-bold text-slate-800">{loading ? "—" : item.value}</p>
              </div>
            </div>
          ))}
        </div>
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {/* ── Error / Table ── */}
      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetch(searchTerm) : fetchTrashed} />
      ) : (
        <BookingTable
          data={currentData}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
          onRestore={handleRestoreClick}
          onForceDelete={handleForceDeleteClick}
          loading={loading}
          isTrashed={view === "trash"}
        />
      )}

      {/* ── Modal ── */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBooking ? "Edit Data Booking" : "Buat Booking Baru"}
        subtitle={selectedBooking ? `Mengubah booking ${selectedBooking.booking_code}` : "Isi detail pemesanan bus"}
        size="xl"
      >
        <BookingForm booking={selectedBooking} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} loading={actionLoading} title="Pindahkan ke Tempat Sampah?" message={`Booking ${bookingToManage?.booking_code} akan dipindahkan ke tempat sampah.`} variant="warning" confirmText="Ya, Pindahkan" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={handleConfirmRestore} loading={actionLoading} title="Pulihkan Booking?" message={`Booking ${bookingToManage?.booking_code} akan dipulihkan ke data aktif.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={handleConfirmForceDelete} loading={actionLoading} variant="danger" title="Hapus Permanen?" message={`Booking ${bookingToManage?.booking_code} akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`} confirmText="Ya, Hapus Permanen" />
    </div>
  )
}
