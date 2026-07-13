import Confirmation from "@/components/feedback/Confirmation"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { ErrorBanner, PageHeader, PageToolbar, StatCard, StatGrid, ViewToggle } from "@/components/ui/PageComponents"
import {
    PaymentTable,
    PaymentVerifyForm,
    usePayments,
    useTrashedPayments,
    type Payment
} from "@/features/admin/payments"
import { useToastStore } from "@/store/useToastStore"
import { CheckCircle, Clock, DollarSign, Receipt, RefreshCcw } from "lucide-react"
import { useState } from "react"
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils"

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

export default function PaymentPage() {
  const [view, setView] = useState<'active' | 'trash'>('active')
  const showSuccess = useToastStore(state => state.showSuccess)

  const { 
    payments, 
    statistics, 
    loading: activeLoading, 
    error, 
    refetch, 
    deletePayment,
    page,
    setPage,
    meta,
    searchTerm,
    setSearchTerm
  } = usePayments()
  
  const { 
    payments: trashedPayments, 
    loading: trashLoading, 
    refetch: refetchTrash,
    restorePayment,
    forceDeletePayment 
  } = useTrashedPayments()

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false)
  const [isProofModalOpen, setIsProofModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [paymentToAction, setPaymentToAction] = useState<Payment | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const runAction = async (fn: () => Promise<void>, closeDialog: () => void, successMsg?: string) => {
    setActionLoading(true)
    try { 
      await fn(); 
      closeDialog(); 
      if (successMsg) showSuccess(successMsg);
    }
    finally { setActionLoading(false) }
  }

  const handleVerify = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsVerifyModalOpen(true)
  }

  const handleViewProof = (payment: Payment) => {
    setSelectedPayment(payment)
    setIsProofModalOpen(true)
  }

  const loading = view === 'active' ? activeLoading : trashLoading

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Verifikasi Pembayaran"
        subtitle="Validasi bukti transfer dan kelola status pembayaran customer"
        badge="Keuangan"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Cari kode booking..."
            extraActions={
              <Button variant="outline" icon={RefreshCcw} className="h-11 rounded-xl px-5" onClick={view === 'active' ? refetch : refetchTrash} loading={loading}>
                Segarkan
              </Button>
            }
          />
        }
      />

      {statistics && (
        <StatGrid columns={4}>
          <StatCard label="Total Terverifikasi" value={formatRp(statistics.cards.total_amount)} icon={DollarSign} color="emerald" loading={activeLoading} />
          <StatCard label="Menunggu" value={statistics.cards.pending_count} icon={Clock} color="amber" loading={activeLoading} />
          <StatCard label="Berhasil" value={statistics.cards.verified_count} icon={CheckCircle} color="blue" loading={activeLoading} />
          <StatCard label="Total Pengajuan" value={statistics.cards.total_count} icon={Receipt} color="violet" loading={activeLoading} />
        </StatGrid>
      )}

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === 'active' ? refetch : refetchTrash} />
      ) : (
        <div className="rounded-[24px] border border-slate-200 bg-white overflow-hidden shadow-sm">
            {view === 'active' ? (
            <>
                <PaymentTable 
                data={payments} 
                loading={activeLoading}
                onVerify={handleVerify}
                onViewProof={handleViewProof}
                onDelete={p => { setPaymentToAction(p); setIsDeleteConfirmOpen(true) }}
                />
                {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
                    <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
                    <span className="text-sm font-medium text-slate-500">Halaman {page} dari {meta.last_page}</span>
                    <Button size="sm" variant="ghost" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>Berikutnya</Button>
                </div>
                )}
            </>
            ) : (
            <PaymentTable 
                data={trashedPayments} 
                loading={trashLoading}
                isTrash
                onVerify={() => {}} 
                onViewProof={handleViewProof}
                onDelete={p => { setPaymentToAction(p); setIsForceDeleteConfirmOpen(true) }}
                onRestore={id => {
                    const p = trashedPayments.find(f => f.id === id) || null;
                    setPaymentToAction(p);
                    setIsRestoreConfirmOpen(true)
                }}
            />
            )}
        </div>
      )}

      <Modal open={isVerifyModalOpen} onClose={() => setIsVerifyModalOpen(false)} title="Verifikasi Pembayaran" subtitle="Tinjau dan ubah status pengajuan pembayaran">
        {selectedPayment && (
          <PaymentVerifyForm payment={selectedPayment} onSuccess={() => { setIsVerifyModalOpen(false); refetch(); showSuccess("Pembayaran berhasil diverifikasi!"); }} onCancel={() => setIsVerifyModalOpen(false)} />
        )}
      </Modal>

      <Modal open={isProofModalOpen} onClose={() => setIsProofModalOpen(false)} title="Bukti Transfer" subtitle={`Invoice: ${selectedPayment?.transaction?.invoice_number}`} size="lg">
        {selectedPayment && (
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 flex justify-center p-2">
              <img src={resolveMediaUrl(selectedPayment.transfer_proof as string)} alt="Transfer Proof" className="max-h-[60vh] w-auto object-contain rounded-lg" />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsProofModalOpen(false)}>Tutup</Button>
            </div>
          </div>
        )}
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={() => runAction(async () => { await deletePayment(paymentToAction!.id); refetchTrash() }, () => setIsDeleteConfirmOpen(false), "Catatan pembayaran berhasil dipindahkan ke sampah.")} loading={actionLoading} title="Hapus Catatan?" message="Catatan pembayaran akan dipindahkan ke sampah." variant="warning" confirmText="Ya, Hapus" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={() => runAction(async () => { await restorePayment(paymentToAction!.id); refetch() }, () => setIsRestoreConfirmOpen(false), "Catatan pembayaran berhasil dipulihkan.")} loading={actionLoading} title="Pulihkan Catatan?" message="Data akan dikembalikan ke daftar aktif." variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={() => runAction(async () => { await forceDeletePayment(paymentToAction!.id) }, () => setIsForceDeleteConfirmOpen(false), "Catatan pembayaran berhasil dihapus permanen.")} loading={actionLoading} variant="danger" title="Hapus Permanen?" message="Tindakan ini akan menghapus data selamanya." confirmText="Ya, Hapus" />
    </div>
  )
}
