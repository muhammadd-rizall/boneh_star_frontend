import Confirmation from "@/components/feedback/Confirmation"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import {
    ErrorBanner,
    PageHeader,
    PageToolbar,
    StatCard,
    ViewToggle,
} from "@/components/ui/PageComponents"
import {
    PaymentMethodForm,
    PaymentMethodTable,
    usePaymentMethods,
    useTrashedPaymentMethods,
    type PaymentMethod,
} from "@/features/admin/payment-methods"
import { useToastStore } from "@/store/useToastStore"
import { Banknote, Layers, Plus, RefreshCcw, ShieldCheck } from "lucide-react"
import { useState } from "react"

export default function PaymentMethodPage() {
  const [view, setView] = useState<'active' | 'trash'>('active')
  const showSuccess = useToastStore(state => state.showSuccess)

  const { 
    paymentMethods, 
    statistics, 
    loading: activeLoading, 
    error: activeError, 
    refetch, 
    deletePaymentMethod,
    searchTerm,
    setSearchTerm
  } = usePaymentMethods()
  
  const { 
    paymentMethods: trashedPaymentMethods, 
    loading: trashLoading, 
    error: trashError,
    refetch: refetchTrash,
    restorePaymentMethod,
    forceDeletePaymentMethod 
  } = useTrashedPaymentMethods()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [paymentMethodToAction, setPaymentMethodToAction] = useState<PaymentMethod | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const handleCreate = () => {
    setSelectedPaymentMethod(null)
    setIsModalOpen(true)
  }

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod)
    setIsModalOpen(true)
  }

  const runAction = async (fn: () => Promise<void>, closeDialog: () => void, successMsg?: string) => {
    setActionLoading(true)
    try { 
      await fn(); 
      closeDialog(); 
      if (successMsg) showSuccess(successMsg);
    }
    finally { setActionLoading(false) }
  }

  const loading = view === 'active' ? activeLoading : trashLoading
  const error = view === 'active' ? activeError : trashError

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Metode Pembayaran"
        subtitle="Kelola rekening bank dan metode pembayaran untuk customer"
        badge="Keuangan"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm}
            searchPlaceholder="Cari bank atau akun..."
            onCreate={handleCreate} createLabel="Tambah Metode" createIcon={Plus}
            extraActions={
              <Button variant="outline" icon={RefreshCcw} className="h-11 rounded-xl px-5" onClick={view === 'active' ? refetch : refetchTrash} loading={loading}>
                Refresh
              </Button>
            }
          />
        }
      />

      {statistics && (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard 
            label="Total Akun" 
            value={statistics.total} 
            icon={Layers} 
            color="blue" 
            loading={activeLoading} 
          />
          <StatCard 
            label="Metode Aktif" 
            value={statistics.active} 
            icon={ShieldCheck} 
            color="emerald" 
            loading={activeLoading}
          />
          <StatCard 
            label="Total Bank" 
            value={new Set(paymentMethods.map(m => m.bank_name)).size} 
            icon={Banknote} 
            color="violet" 
            loading={activeLoading}
          />
        </div>
      )}

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === 'active' ? refetch : refetchTrash} />
      ) : (
        <div className="rounded-[24px] border border-slate-200 bg-white overflow-hidden shadow-sm">
          {view === 'active' ? (
            <PaymentMethodTable 
              data={paymentMethods} 
              loading={activeLoading}
              onEdit={handleEdit}
              onDelete={p => { setPaymentMethodToAction(p); setIsDeleteConfirmOpen(true) }}
            />
          ) : (
            <PaymentMethodTable 
              data={trashedPaymentMethods} 
              loading={trashLoading}
              isTrash
              onEdit={() => {}} 
              onDelete={p => { setPaymentMethodToAction(p); setIsForceDeleteConfirmOpen(true) }}
              onRestore={id => {
                  const p = trashedPaymentMethods.find(f => f.id === id) || null;
                  setPaymentMethodToAction(p);
                  setIsRestoreConfirmOpen(true)
              }}        />
          )}
        </div>
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedPaymentMethod ? "Edit Metode Pembayaran" : "Tambah Metode Baru"} subtitle="Pastikan data rekening bank sudah benar">
        <PaymentMethodForm
          paymentMethod={selectedPaymentMethod}
          onSuccess={() => { setIsModalOpen(false); refetch(); showSuccess(selectedPaymentMethod ? "Metode pembayaran berhasil diperbarui!" : "Metode pembayaran baru berhasil ditambahkan!"); }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={() => runAction(async () => { await deletePaymentMethod(paymentMethodToAction!.id); refetchTrash() }, () => setIsDeleteConfirmOpen(false), `Metode "${paymentMethodToAction?.bank_name}" dipindahkan ke sampah.`)} loading={actionLoading} title="Hapus Metode?" message={`Metode "${paymentMethodToAction?.bank_name}" akan dipindahkan ke sampah.`} variant="warning" confirmText="Ya, Hapus" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={() => runAction(async () => { await restorePaymentMethod(paymentMethodToAction!.id); refetch() }, () => setIsRestoreConfirmOpen(false), `Metode "${paymentMethodToAction?.bank_name}" berhasil dipulihkan.`)} loading={actionLoading} title="Pulihkan Metode?" message={`Metode "${paymentMethodToAction?.bank_name}" akan dikembalikan ke daftar aktif.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={() => runAction(async () => { await forceDeletePaymentMethod(paymentMethodToAction!.id) }, () => setIsForceDeleteConfirmOpen(false), `Metode "${paymentMethodToAction?.bank_name}" berhasil dihapus permanen.`)} loading={actionLoading} variant="danger" title="Hapus Permanen?" message="Data rekening akan dihapus selamanya." confirmText="Ya, Hapus" />
    </div>
  )
}
