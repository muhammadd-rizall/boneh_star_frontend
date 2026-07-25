import Confirmation from "@/components/feedback/Confirmation"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { ErrorBanner, PageHeader, PageToolbar, StatCard, StatGrid, ViewToggle } from "@/components/ui/PageComponents"
import {
    ActivityTypeForm,
    ActivityTypeTable,
    useActivityTypes, useTrashedActivityTypes, type ActivityType,
} from "@/features/admin/activity-types"
import { useToastStore } from "@/store/useToastStore"
import { CheckCircle2, Plus, RefreshCcw, Tag, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function ActivityTypePage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const [searchTerm, setSearchTerm] = useState("")
  const showSuccess = useToastStore(state => state.showSuccess)

  const { activityTypes, statistics, loading: activeLoading, error: activeError, deleteActivityType, refetch: refetchActive } = useActivityTypes()
  const { activityTypes: trashedTypes, loading: trashLoading, error: trashError, refetch: refetchTrash, restoreActivityType, forceDeleteActivityType } = useTrashedActivityTypes()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<ActivityType | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false)
  const [typeToAction, setTypeToAction] = useState<ActivityType | null>(null)

  useEffect(() => { if (view === "active") { const t = setTimeout(() => refetchActive(searchTerm), 500); return () => clearTimeout(t) } }, [searchTerm, view, refetchActive])
  useEffect(() => { if (view === "trash") refetchTrash() }, [view, refetchTrash])

  const loading = view === "active" ? activeLoading : trashLoading
  const error = view === "active" ? activeError : trashError
  const displayData = view === "active" ? activityTypes : trashedTypes.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Jenis Aktivitas"
        subtitle="Kelola tipe dan kategori aktivitas bus"
        badge="Operasional"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Cari jenis aktivitas..."
            onCreate={() => { setSelectedType(null); setIsModalOpen(true) }} createLabel="Tambah Jenis" createIcon={Plus} createPermission="activities.create"
            extraActions={<Button variant="outline" icon={RefreshCcw} className="h-11 rounded-xl px-5" onClick={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>Refresh</Button>}
          />
        }
      />

      <StatGrid columns={3}>
        <StatCard label="Total Aktivitas" value={statistics?.total ?? 0} icon={Tag} loading={activeLoading} />
        <StatCard label="Aktif" value={statistics?.total ?? 0} icon={CheckCircle2} loading={activeLoading} color="emerald" />
        <StatCard label="Tong Sampah" value={statistics?.trashed ?? 0} icon={Trash2} loading={activeLoading} color="rose" />
      </StatGrid>

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} />
      ) : (
        <ActivityTypeTable data={displayData} loading={loading} isTrash={view === "trash"}
          onEdit={t => { setSelectedType(t); setIsModalOpen(true) }}
          onDelete={t => { 
            setTypeToAction(t); 
            if (view === "trash") {
              setIsForceDeleteOpen(true);
            } else {
              setIsDeleteOpen(true);
            }
          }}
          onRestore={id => { const t = trashedTypes.find(x => x.id === id) || null; setTypeToAction(t); setIsRestoreOpen(true) }}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedType ? "Edit Jenis Aktivitas" : "Tambah Jenis Aktivitas"}>
        <ActivityTypeForm activityType={selectedType} onSuccess={() => { setIsModalOpen(false); refetchActive(searchTerm); refetchTrash(); showSuccess(selectedType ? "Jenis aktivitas berhasil diperbarui!" : "Jenis aktivitas baru berhasil ditambahkan!"); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (typeToAction) { await deleteActivityType(typeToAction.id); setIsDeleteOpen(false); setTypeToAction(null); refetchActive(searchTerm); showSuccess(`"${typeToAction?.name}" dipindahkan ke sampah.`); } }} title="Hapus Jenis Aktivitas?" message={`"${typeToAction?.name}" akan dipindahkan ke sampah.`} variant="warning" confirmText="Ya, Hapus" />
      <Confirmation open={isRestoreOpen} onClose={() => setIsRestoreOpen(false)} onConfirm={async () => { if (typeToAction) { await restoreActivityType(typeToAction.id); setIsRestoreOpen(false); setTypeToAction(null); refetchActive(searchTerm); showSuccess(`"${typeToAction?.name}" berhasil dipulihkan.`); } }} title="Pulihkan?" message={`"${typeToAction?.name}" akan dipulihkan.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteOpen} onClose={() => setIsForceDeleteOpen(false)} onConfirm={async () => { if (typeToAction) { await forceDeleteActivityType(typeToAction.id); setIsForceDeleteOpen(false); setTypeToAction(null); refetchActive(searchTerm); showSuccess(`"${typeToAction?.name}" berhasil dihapus permanen.`); } }} title="Hapus Permanen?" message={`"${typeToAction?.name}" akan dihapus permanen.`} variant="danger" confirmText="Ya, Hapus" />
    </div>
  )
}
