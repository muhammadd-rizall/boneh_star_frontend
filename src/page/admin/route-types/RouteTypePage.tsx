import { useState, useEffect } from "react"
import { useRouteTypes, useTrashedRouteTypes } from "@/features/admin/route-types/hooks/useRouteTypes"
import RouteTypeTable from "@/features/admin/route-types/components/RouteTypeTable"
import RouteTypeForm from "@/features/admin/route-types/components/RouteTypeForm"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import Confirmation from "@/components/feedback/Confirmation"
import { PageHeader, StatCard, StatGrid, ViewToggle, PageToolbar, ErrorBanner } from "@/components/ui/PageComponents"
import type { RouteType } from "@/features/admin/route-types/types/RouteType"
import { Plus, RefreshCcw, Map, MapPin, Trash2 } from "lucide-react"

export default function RouteTypePage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const [searchTerm, setSearchTerm] = useState("")

  const { routeTypes, statistics, loading: activeLoading, error: activeError, deleteRouteType, refetch: refetchActive } = useRouteTypes()
  const { routeTypes: trashedRouteTypes, loading: trashLoading, error: trashError, refetch: refetchTrash, restoreRouteType, forceDeleteRouteType } = useTrashedRouteTypes()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRouteType, setSelectedRouteType] = useState<RouteType | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false)
  const [routeTypeToAction, setRouteTypeToAction] = useState<RouteType | null>(null)

  useEffect(() => { if (view === "active") { const t = setTimeout(() => refetchActive(searchTerm), 500); return () => clearTimeout(t) } }, [searchTerm, view, refetchActive])
  useEffect(() => { if (view === "trash") refetchTrash() }, [view, refetchTrash])

  const loading = view === "active" ? activeLoading : trashLoading
  const error = view === "active" ? activeError : trashError
  const displayData = view === "active" ? routeTypes : trashedRouteTypes.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Tipe Rute"
        subtitle="Kelola kategori rute dan jalur perjalanan bus"
        badge="Operasional"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Cari tipe rute..."
            onCreate={() => { setSelectedRouteType(null); setIsModalOpen(true) }} createLabel="Tambah Rute" createIcon={Plus}
            extraActions={<Button variant="outline" icon={RefreshCcw} size="sm" onClick={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>Refresh</Button>}
          />
        }
      />

      <StatGrid columns={3}>
        <StatCard label="Total Rute" value={statistics?.total ?? 0} icon={Map} loading={activeLoading} />
        <StatCard label="Aktif" value={statistics?.total ?? 0} icon={MapPin} loading={activeLoading} color="emerald" />
        <StatCard label="Tong Sampah" value={statistics?.trashed ?? 0} icon={Trash2} loading={activeLoading} color="rose" />
      </StatGrid>

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Semua" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} />
      ) : (
        <RouteTypeTable data={displayData} loading={loading} isTrash={view === "trash"}
          onEdit={r => { setSelectedRouteType(r); setIsModalOpen(true) }}
          onDelete={r => { 
            setRouteTypeToAction(r); 
            if (view === "trash") {
              setIsForceDeleteOpen(true);
            } else {
              setIsDeleteOpen(true);
            }
          }}
          onRestore={id => { const r = trashedRouteTypes.find(x => x.id === id) || null; setRouteTypeToAction(r); setIsRestoreOpen(true) }}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRouteType ? "Edit Tipe Rute" : "Tambah Tipe Rute Baru"}>
        <RouteTypeForm routeType={selectedRouteType} onSuccess={() => { setIsModalOpen(false); refetchActive(searchTerm); refetchTrash() }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (routeTypeToAction) { await deleteRouteType(routeTypeToAction.id); setIsDeleteOpen(false); setRouteTypeToAction(null); refetchActive(searchTerm) } }} title="Hapus Tipe Rute?" message={`"${routeTypeToAction?.name}" akan dipindahkan ke sampah.`} variant="warning" confirmText="Ya, Hapus" />
      <Confirmation open={isRestoreOpen} onClose={() => setIsRestoreOpen(false)} onConfirm={async () => { if (routeTypeToAction) { await restoreRouteType(routeTypeToAction.id); setIsRestoreOpen(false); setRouteTypeToAction(null); refetchActive(searchTerm) } }} title="Pulihkan?" message={`"${routeTypeToAction?.name}" akan dipulihkan.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteOpen} onClose={() => setIsForceDeleteOpen(false)} onConfirm={async () => { if (routeTypeToAction) { await forceDeleteRouteType(routeTypeToAction.id); setIsForceDeleteOpen(false); setRouteTypeToAction(null); refetchActive(searchTerm) } }} title="Hapus Permanen?" message={`"${routeTypeToAction?.name}" akan dihapus permanen.`} variant="danger" confirmText="Ya, Hapus" />
    </div>
  )
}
