import { useState, useEffect } from "react"
import {
  DriverTable,
  DriverForm,
  useDrivers,
  useTrashedDrivers,
  type Driver,
} from "@/features/admin/drivers"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import {
  PageHeader, StatCard, ViewToggle, PageToolbar, ErrorBanner,
} from "@/components/ui/PageComponents"
import { Plus, RefreshCcw, UserCircle, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function DriverPage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const [searchTerm, setSearchTerm] = useState("")

  const { drivers, statistics, loading: activeLoading, error: activeError, deleteDriver, refetch: refetchActive } = useDrivers()
  const { drivers: trashedDrivers, loading: trashLoading, error: trashError, refetch: refetchTrash, restoreDriver, forceDeleteDriver } = useTrashedDrivers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [driverToManage, setDriverToManage] = useState<Driver | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (view === "active") { const t = setTimeout(() => refetchActive(searchTerm), 500); return () => clearTimeout(t) }
  }, [searchTerm, view, refetchActive])
  useEffect(() => { if (view === "trash") refetchTrash() }, [view, refetchTrash])

  const handleCreate = () => { setSelectedDriver(null); setIsModalOpen(true) }
  const handleEdit = (d: Driver) => { setSelectedDriver(d); setIsModalOpen(true) }
  const handleSuccess = () => { setIsModalOpen(false); if (view === "active") refetchActive(searchTerm); else refetchTrash() }
  const handleDeleteClick = (d: Driver) => { setDriverToManage(d); setIsDeleteConfirmOpen(true) }
  const handleConfirmDelete = async () => { if (!driverToManage) return; setActionLoading(true); try { await deleteDriver(driverToManage.id); setIsDeleteConfirmOpen(false); setDriverToManage(null) } finally { setActionLoading(false) } }
  const handleRestoreClick = (id: string) => { const d = trashedDrivers.find(x => x.id === id); if (d) { setDriverToManage(d); setIsRestoreConfirmOpen(true) } }
  const handleConfirmRestore = async () => { if (!driverToManage) return; setActionLoading(true); try { await restoreDriver(driverToManage.id); setIsRestoreConfirmOpen(false); setDriverToManage(null); refetchActive(searchTerm) } finally { setActionLoading(false) } }
  const handleForceDeleteClick = (d: Driver) => { setDriverToManage(d); setIsForceDeleteConfirmOpen(true) }
  const handleConfirmForceDelete = async () => { if (!driverToManage) return; setActionLoading(true); try { await forceDeleteDriver(driverToManage.id); setIsForceDeleteConfirmOpen(false); setDriverToManage(null) } finally { setActionLoading(false) } }

  const loading = view === "active" ? activeLoading : trashLoading
  const error = view === "active" ? activeError : trashError
  const displayData = view === "active" ? drivers : trashedDrivers.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manajemen Pengemudi"
        subtitle="Kelola data pengemudi dan status tugasnya"
        badge="Pengemudi"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm}
            searchPlaceholder="Cari nama atau no. telepon..."
            onCreate={handleCreate} createLabel="Tambah Pengemudi" createIcon={Plus}
            extraActions={<Button variant="outline" icon={RefreshCcw} size="sm" onClick={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>Refresh</Button>}
          />
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Pengemudi" value={statistics?.total ?? 0} icon={UserCircle} loading={activeLoading} />
        <StatCard label="Tersedia" value={statistics?.available ?? 0} icon={CheckCircle2} loading={activeLoading} color="emerald" />
        <StatCard label="Sedang Bertugas" value={statistics?.on_duty ?? 0} icon={Clock} loading={activeLoading} color="blue" />
        <StatCard label="Tidak Aktif" value={statistics?.inactive ?? 0} icon={AlertCircle} loading={activeLoading} color="rose" />
      </div>

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} />
      ) : (
        <DriverTable data={displayData} onDelete={view === "active" ? handleDeleteClick : handleForceDeleteClick} onEdit={handleEdit} onRestore={handleRestoreClick} loading={loading} isTrash={view === "trash"} />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDriver ? "Edit Pengemudi" : "Tambah Pengemudi Baru"} subtitle={selectedDriver ? `Mengubah data ${selectedDriver.name}` : "Daftarkan pengemudi baru"} size="lg">
        <DriverForm driver={selectedDriver} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleConfirmDelete} loading={actionLoading} title="Pindah ke Sampah?" message={`Pengemudi "${driverToManage?.name}" akan dipindahkan ke tempat sampah.`} variant="warning" confirmText="Ya, Pindahkan" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={handleConfirmRestore} loading={actionLoading} title="Pulihkan Pengemudi?" message={`Pengemudi "${driverToManage?.name}" akan dipulihkan ke data aktif.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={handleConfirmForceDelete} loading={actionLoading} variant="danger" title="Hapus Permanen?" message={`Pengemudi "${driverToManage?.name}" akan dihapus secara permanen.`} confirmText="Ya, Hapus" />
    </div>
  )
}
