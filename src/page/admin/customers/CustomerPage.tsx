import Confirmation from "@/components/feedback/Confirmation"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { ErrorBanner, PageHeader, PageToolbar, StatCard, StatGrid, ViewToggle } from "@/components/ui/PageComponents"
import { CustomerForm, CustomerTable, useCustomers, useTrashedCustomers, type Customer } from "@/features/admin/customers"
import { useToastStore } from "@/store/useToastStore"
import { Heart, RefreshCcw, UserCheck, UserPlus, Users } from "lucide-react"
import { useEffect, useState } from "react"

export default function CustomerPage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const [searchTerm, setSearchTerm] = useState("")
  const showSuccess = useToastStore(state => state.showSuccess)

  const { customers, statistics, loading: activeLoading, error: activeError, deleteCustomer, refetch: refetchActive, searchCustomers } = useCustomers()
  const { customers: trashedCustomers, loading: trashLoading, error: trashError, refetch: refetchTrash, restoreCustomer, forceDeleteCustomer } = useTrashedCustomers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [customerToManage, setCustomerToManage] = useState<Customer | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // searchCustomers sudah ada debounce 350ms di dalam hook
  useEffect(() => { if (view === "active") searchCustomers(searchTerm) }, [searchTerm, view, searchCustomers])
  useEffect(() => { if (view === "trash") refetchTrash() }, [view, refetchTrash])

  const handleSuccess = () => { 
    setIsModalOpen(false); 
    if (view === "active") refetchActive(searchTerm); else refetchTrash();
    showSuccess(selectedCustomer ? "Data pelanggan berhasil diperbarui!" : "Pelanggan baru berhasil ditambahkan!");
  }
  const handleConfirmDelete = async () => { 
    if (!customerToManage) return; 
    setActionLoading(true); 
    try { 
      await deleteCustomer(customerToManage.id); 
      setIsDeleteConfirmOpen(false); 
      showSuccess(`Pelanggan "${customerToManage.name}" dipindahkan ke sampah.`);
      setCustomerToManage(null) 
    } finally { 
      setActionLoading(false) 
    } 
  }
  const handleConfirmRestore = async () => { 
    if (!customerToManage) return; 
    setActionLoading(true); 
    try { 
      await restoreCustomer(customerToManage.id); 
      setIsRestoreConfirmOpen(false); 
      showSuccess(`Pelanggan "${customerToManage.name}" berhasil dipulihkan.`);
      setCustomerToManage(null); 
      refetchActive(searchTerm) 
    } finally { 
      setActionLoading(false) 
    } 
  }
  const handleConfirmForceDelete = async () => { 
    if (!customerToManage) return; 
    setActionLoading(true); 
    try { 
      await forceDeleteCustomer(customerToManage.id); 
      setIsForceDeleteConfirmOpen(false); 
      showSuccess(`Pelanggan "${customerToManage.name}" berhasil dihapus permanen.`);
      setCustomerToManage(null) 
    } finally { 
      setActionLoading(false) 
    } 
  }

  const loading = view === "active" ? activeLoading : trashLoading
  const error = view === "active" ? activeError : trashError
  const displayData = view === "active" ? customers : trashedCustomers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Manajemen Pelanggan"
        subtitle="Kelola data dan akun pelanggan yang terdaftar"
        badge="Pelanggan"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Cari pelanggan..."
            onCreate={() => { setSelectedCustomer(null); setIsModalOpen(true) }} createLabel="Tambah Pelanggan" createIcon={UserPlus}
            extraActions={<Button variant="outline" icon={RefreshCcw} className="h-11 rounded-xl px-5" onClick={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>Refresh</Button>}
          />
        }
      />

      <StatGrid columns={4}>
        <StatCard label="Total Pelanggan" value={statistics?.cards.total ?? 0} icon={Users} loading={activeLoading} />
        <StatCard label="Aktif" value={statistics?.cards.active ?? 0} icon={UserCheck} loading={activeLoading} color="emerald" />
        <StatCard label="Anggota Baru" value={statistics?.cards.new_members ?? 0} icon={UserPlus} loading={activeLoading} color="blue" />
        <StatCard label="Pelanggan Setia" value={statistics?.cards.loyal_customers ?? 0} icon={Heart} loading={activeLoading} color="violet" />
      </StatGrid>

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} />
      ) : (
        <CustomerTable data={displayData} onDelete={view === "active" ? c => { setCustomerToManage(c); setIsDeleteConfirmOpen(true) } : c => { setCustomerToManage(c); setIsForceDeleteConfirmOpen(true) }} onEdit={c => { setSelectedCustomer(c); setIsModalOpen(true) }} onRestore={id => { const c = trashedCustomers.find(x => x.id === id); if (c) { setCustomerToManage(c); setIsRestoreConfirmOpen(true) } }} loading={loading} isTrash={view === "trash"} />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCustomer ? "Edit Pelanggan" : "Daftarkan Pelanggan Baru"} subtitle={selectedCustomer ? `Mengubah data ${selectedCustomer.name}` : "Lengkapi informasi pelanggan"}>
        <CustomerForm customer={selectedCustomer} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleConfirmDelete} loading={actionLoading} title="Pindah ke Sampah?" message={`Pelanggan "${customerToManage?.name}" akan dipindahkan ke tong sampah.`} variant="warning" confirmText="Ya, Pindahkan" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={handleConfirmRestore} loading={actionLoading} title="Pulihkan Pelanggan?" message={`Pelanggan "${customerToManage?.name}" akan dipulihkan.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={handleConfirmForceDelete} loading={actionLoading} variant="danger" title="Hapus Permanen?" message={`Pelanggan "${customerToManage?.name}" akan dihapus secara permanen.`} confirmText="Ya, Hapus Permanen" />
    </div>
  )
}
