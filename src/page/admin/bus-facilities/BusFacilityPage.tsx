import { useState, useEffect } from "react"
import { useBusFacilities, useTrashedBusFacilities } from "@/features/admin/bus-facilities/hooks/useBusFacilities"
import BusFacilityTable from "@/features/admin/bus-facilities/components/BusFacilityTable"
import BusFacilityForm from "@/features/admin/bus-facilities/components/BusFacilityForm"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Confirmation from "@/components/feedback/Confirmation"
import { PageHeader, StatCard, StatGrid, ViewToggle, PageToolbar, ErrorBanner } from "@/components/ui/PageComponents"
import type { BusFacility } from "@/features/admin/bus-facilities/types/BusFacility"
import { Plus, RefreshCcw, Wrench, Shield, Trash2 } from "lucide-react"

export default function BusFacilityPage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const [searchTerm, setSearchTerm] = useState("")

  const { facilities, statistics, loading: activeLoading, error: activeError, deleteFacility, refetch: refetchActive } = useBusFacilities()
  const { facilities: trashedFacilities, loading: trashLoading, error: trashError, refetch: refetchTrash, restoreFacility, forceDeleteFacility } = useTrashedBusFacilities()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<BusFacility | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false)
  const [facilityToAction, setFacilityToAction] = useState<BusFacility | null>(null)

  useEffect(() => { if (view === "active") { const t = setTimeout(() => refetchActive(searchTerm), 500); return () => clearTimeout(t) } }, [searchTerm, view, refetchActive])
  useEffect(() => { if (view === "trash") refetchTrash() }, [view, refetchTrash])

  const loading = view === "active" ? activeLoading : trashLoading
  const error = view === "active" ? activeError : trashError
  const displayData = view === "active" ? facilities : trashedFacilities.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Fasilitas Bus"
        subtitle="Kelola daftar fasilitas dan kelengkapan kendaraan"
        badge="Armada"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Cari fasilitas..."
            onCreate={() => { setSelectedFacility(null); setIsModalOpen(true) }} createLabel="Tambah Fasilitas" createIcon={Plus}
            extraActions={<Button variant="outline" icon={RefreshCcw} size="sm" onClick={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>Refresh</Button>}
          />
        }
      />

      <StatGrid columns={3}>
        <StatCard label="Total Fasilitas" value={statistics?.total ?? 0} icon={Wrench} loading={activeLoading} />
        <StatCard label="Aktif" value={statistics?.total ?? 0} icon={Shield} loading={activeLoading} color="emerald" />
        <StatCard label="Tong Sampah" value={statistics?.trashed ?? 0} icon={Trash2} loading={activeLoading} color="rose" />
      </StatGrid>

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Semua" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} />
      ) : (
        <BusFacilityTable data={displayData} loading={loading} isTrash={view === "trash"}
          onEdit={f => { setSelectedFacility(f); setIsModalOpen(true) }}
          onDelete={f => { 
            setFacilityToAction(f); 
            if (view === "trash") {
              setIsForceDeleteOpen(true);
            } else {
              setIsDeleteOpen(true);
            }
          }}
          onRestore={id => { const f = trashedFacilities.find(x => x.id === id) || null; setFacilityToAction(f); setIsRestoreOpen(true) }}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedFacility ? "Edit Fasilitas" : "Tambah Fasilitas Baru"}>
        <BusFacilityForm facility={selectedFacility} onSuccess={() => { setIsModalOpen(false); refetchActive(searchTerm); refetchTrash() }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (facilityToAction) { await deleteFacility(facilityToAction.id); setIsDeleteOpen(false); setFacilityToAction(null); refetchActive(searchTerm) } }} title="Hapus Fasilitas?" message={`"${facilityToAction?.name}" akan dipindahkan ke sampah.`} variant="warning" confirmText="Ya, Hapus" />
      <Confirmation open={isRestoreOpen} onClose={() => setIsRestoreOpen(false)} onConfirm={async () => { if (facilityToAction) { await restoreFacility(facilityToAction.id); setIsRestoreOpen(false); setFacilityToAction(null); refetchActive(searchTerm) } }} title="Pulihkan?" message={`"${facilityToAction?.name}" akan dipulihkan.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteOpen} onClose={() => setIsForceDeleteOpen(false)} onConfirm={async () => { if (facilityToAction) { await forceDeleteFacility(facilityToAction.id); setIsForceDeleteOpen(false); setFacilityToAction(null); refetchActive(searchTerm) } }} title="Hapus Permanen?" message={`"${facilityToAction?.name}" akan dihapus permanen.`} variant="danger" confirmText="Ya, Hapus" />
    </div>
  )
}
