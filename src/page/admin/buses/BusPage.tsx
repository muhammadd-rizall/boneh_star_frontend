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
    BusTable,
    useBuses,
    useTrashedBuses,
    type Bus,
} from "@/features/admin/buses"
import BusForm from "@/features/admin/buses/components/BusForm"
import { Bus as BusIcon, LayoutGrid, Plus, RefreshCcw, ShieldCheck, Wrench } from "lucide-react"
import { useEffect, useState } from "react"

export default function BusPage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const [searchTerm, setSearchTerm] = useState("")

  const { buses, statistics, loading: activeLoading, error: activeError, deleteBus, refetch: refetchActive } = useBuses()
  const { buses: trashedBuses, loading: trashLoading, error: trashError, refetch: refetchTrash, restoreBus, forceDeleteBus } = useTrashedBuses()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [busToManage, setBusToManage] = useState<Bus | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (view === "active") {
      const t = setTimeout(() => refetchActive(searchTerm), 500)
      return () => clearTimeout(t)
    }
  }, [searchTerm, view, refetchActive])

  useEffect(() => {
    if (view === "trash") refetchTrash()
  }, [view, refetchTrash])

  const handleCreate = () => { setSelectedBus(null); setIsModalOpen(true) }
  const handleEdit = (b: Bus) => { setSelectedBus(b); setIsModalOpen(true) }
  const handleSuccess = () => { setIsModalOpen(false); if (view === "active") refetchActive(searchTerm); else refetchTrash() }

  const handleDeleteClick = (b: Bus) => { setBusToManage(b); setIsDeleteConfirmOpen(true) }
  const handleConfirmDelete = async () => {
    if (!busToManage) return; setActionLoading(true)
    try { 
      await deleteBus(busToManage.id); 
      setIsDeleteConfirmOpen(false); 
      setBusToManage(null);
      refetchActive(searchTerm);
    }
    finally { setActionLoading(false) }
  }

  const handleRestoreClick = (id: string) => {
    const b = trashedBuses.find(x => x.id === id)
    if (b) { setBusToManage(b); setIsRestoreConfirmOpen(true) }
  }
  const handleConfirmRestore = async () => {
    if (!busToManage) return; setActionLoading(true)
    try { await restoreBus(busToManage.id); setIsRestoreConfirmOpen(false); setBusToManage(null); refetchActive(searchTerm) }
    finally { setActionLoading(false) }
  }

  const handleForceDeleteClick = (b: Bus) => { setBusToManage(b); setIsForceDeleteConfirmOpen(true) }
  const handleConfirmForceDelete = async () => {
    if (!busToManage) return; setActionLoading(true)
    try { 
      await forceDeleteBus(busToManage.id); 
      setIsForceDeleteConfirmOpen(false); 
      setBusToManage(null);
      refetchActive(searchTerm);
      refetchTrash();
    }
    finally { setActionLoading(false) }
  }

  const loading = view === "active" ? activeLoading : trashLoading
  const error = view === "active" ? activeError : trashError
  const displayData = view === "active"
    ? buses
    : trashedBuses.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.plat_number.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Manajemen Armada Bus"
        subtitle="Kelola seluruh data kendaraan bus"
        badge="Armada"
        actions={
          <PageToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari nama atau nomor plat..."
            onCreate={handleCreate}
            createLabel="Tambah Bus"
            createIcon={Plus}
            extraActions={
              <Button
                variant="outline"
                icon={RefreshCcw}
                className="h-11 rounded-xl px-5"
                onClick={view === "active" ? () => refetchActive(searchTerm) : refetchTrash}
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
        <StatCard label="Total Armada" value={statistics?.cards.total ?? 0} icon={LayoutGrid} loading={activeLoading} />
        <StatCard label="Tersedia" value={statistics?.cards.available ?? 0} icon={ShieldCheck} loading={activeLoading} color="emerald" />
        <StatCard label="Terpesan" value={statistics?.cards.booked ?? 0} icon={BusIcon} loading={activeLoading} color="blue" />
        <StatCard label="Perawatan" value={statistics?.cards.maintenance ?? 0} icon={Wrench} loading={activeLoading} color="amber" />
      </StatGrid>

      {/* ── View Toggle ── */}
      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {/* ── Error / Table ── */}
      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} />
      ) : (
        <BusTable
          data={displayData}
          onDelete={view === "active" ? handleDeleteClick : handleForceDeleteClick}
          onEdit={handleEdit}
          onRestore={handleRestoreClick}
          loading={loading}
          isTrash={view === "trash"}
        />
      )}

      {/* ── Modal ── */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBus ? "Edit Data Bus" : "Tambah Bus Baru"}
        subtitle={selectedBus ? `Mengubah data bus ${selectedBus.name}` : "Daftarkan kendaraan baru ke armada"}
        size="xl"
      >
        <BusForm bus={selectedBus} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleConfirmDelete} loading={actionLoading} title="Pindah ke Tempat Sampah?" message={`Bus "${busToManage?.name}" akan dipindahkan ke tempat sampah.`} variant="warning" confirmText="Ya, Pindahkan" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={handleConfirmRestore} loading={actionLoading} title="Pulihkan Bus?" message={`Bus "${busToManage?.name}" akan dipulihkan ke armada aktif.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={handleConfirmForceDelete} loading={actionLoading} variant="danger" title="Hapus Permanen?" message={`Bus "${busToManage?.name}" akan dihapus secara permanen termasuk semua data terkait.`} confirmText="Ya, Hapus Permanen" />
    </div>
  )
}
