import Confirmation from "@/components/feedback/Confirmation"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { ErrorBanner, PageHeader, PageToolbar, StatCard, StatGrid, ViewToggle } from "@/components/ui/PageComponents"
import BusCategoryForm from "@/features/admin/bus-categories/components/BusCategoryForm"
import BusCategoryTable from "@/features/admin/bus-categories/components/BusCategoryTable"
import { useBusCategories, useTrashedBusCategories } from "@/features/admin/bus-categories/hooks/useBusCategories"
import type { BusCategory } from "@/features/admin/bus-categories/types/BusCategory"
import { useToastStore } from "@/store/useToastStore"
import { Layers, LayoutGrid, Plus, RefreshCcw, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function BusCategoryPage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const [searchTerm, setSearchTerm] = useState("")
  const showSuccess = useToastStore(state => state.showSuccess)

  const { categories, statistics, loading: activeLoading, error: activeError, deleteCategory, refetch: refetchActive } = useBusCategories()
  const { categories: trashedCategories, loading: trashLoading, error: trashError, refetch: refetchTrash, restoreCategory, forceDeleteCategory } = useTrashedBusCategories()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<BusCategory | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isRestoreOpen, setIsRestoreOpen] = useState(false)
  const [isForceDeleteOpen, setIsForceDeleteOpen] = useState(false)
  const [categoryToAction, setCategoryToAction] = useState<BusCategory | null>(null)

  useEffect(() => { if (view === "active") { const t = setTimeout(() => refetchActive(searchTerm), 500); return () => clearTimeout(t) } }, [searchTerm, view, refetchActive])
  useEffect(() => { if (view === "trash") refetchTrash() }, [view, refetchTrash])

  const loading = view === "active" ? activeLoading : trashLoading
  const error = view === "active" ? activeError : trashError
  const displayData = view === "active" ? categories : trashedCategories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Kategori Bus"
        subtitle="Kelola klasifikasi dan tipe ukuran kendaraan bus"
        badge="Armada"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Cari kategori..."
            onCreate={() => { setSelectedCategory(null); setIsModalOpen(true) }} createLabel="Tambah Kategori" createIcon={Plus}
            extraActions={<Button variant="outline" icon={RefreshCcw} className="h-11 rounded-xl px-5" onClick={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>Refresh</Button>}
          />
        }
      />

      <StatGrid columns={3}>
        <StatCard label="Total Kategori" value={statistics?.total ?? 0} icon={Layers} loading={activeLoading} />
        <StatCard label="Aktif" value={statistics?.total ?? 0} icon={LayoutGrid} loading={activeLoading} color="emerald" />
        <StatCard label="Tong Sampah" value={statistics?.trashed ?? 0} icon={Trash2} loading={activeLoading} color="rose" />
      </StatGrid>

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} />
      ) : (
        <BusCategoryTable data={displayData} loading={loading} isTrash={view === "trash"}
          onEdit={c => { setSelectedCategory(c); setIsModalOpen(true) }}
          onDelete={c => { 
            setCategoryToAction(c); 
            if (view === "trash") {
              setIsForceDeleteOpen(true);
            } else {
              setIsDeleteOpen(true);
            }
          }}
          onRestore={id => { const c = trashedCategories.find(x => x.id === id) || null; setCategoryToAction(c); setIsRestoreOpen(true) }}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCategory ? "Edit Kategori" : "Tambah Kategori Baru"} subtitle="Klasifikasi bus berdasarkan kapasitas">
        <BusCategoryForm category={selectedCategory} onSuccess={() => { setIsModalOpen(false); refetchActive(searchTerm); refetchTrash(); showSuccess(selectedCategory ? "Kategori bus berhasil diperbarui!" : "Kategori bus baru berhasil ditambahkan!"); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={async () => { if (categoryToAction) { await deleteCategory(categoryToAction.id); setIsDeleteOpen(false); setCategoryToAction(null); refetchActive(searchTerm); showSuccess(`"${categoryToAction?.name}" dipindahkan ke sampah.`); } }} title="Hapus Kategori?" message={`"${categoryToAction?.name}" akan dipindahkan ke sampah.`} variant="warning" confirmText="Ya, Hapus" />
      <Confirmation open={isRestoreOpen} onClose={() => setIsRestoreOpen(false)} onConfirm={async () => { if (categoryToAction) { await restoreCategory(categoryToAction.id); setIsRestoreOpen(false); setCategoryToAction(null); refetchActive(searchTerm); showSuccess(`"${categoryToAction?.name}" berhasil dipulihkan.`); } }} title="Pulihkan Kategori?" message={`"${categoryToAction?.name}" akan dipulihkan.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteOpen} onClose={() => setIsForceDeleteOpen(false)} onConfirm={async () => { 
        if (categoryToAction) { 
          try {
            await forceDeleteCategory(categoryToAction.id); 
            setIsForceDeleteOpen(false); 
            setCategoryToAction(null); 
            refetchActive(searchTerm);
            refetchTrash();
            showSuccess(`"${categoryToAction?.name}" berhasil dihapus permanen.`);
          } catch (err) {
            // Error ditangani oleh hook
          }
        } 
      }} title="Hapus Permanen?" message={`"${categoryToAction?.name}" akan dihapus secara permanen.`} variant="danger" confirmText="Ya, Hapus Permanen" />
    </div>
  )
}
