import { useState, useEffect } from "react"
import {
  TransactionTable,
  TransactionForm,
  useTransactions,
  type Transaction,
} from "@/features/admin/transactions"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import {
  PageHeader, StatCard, ViewToggle, PageToolbar, ErrorBanner,
} from "@/components/ui/PageComponents"
import { Plus, RefreshCcw, TrendingUp, Banknote, Clock, CheckCircle2 } from "lucide-react"

const formatRp = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n)

export default function TransactionPage() {
  const {
    transactions, trashedTransactions, statistics, loading, error,
    deleteTransaction, restoreTransaction, forceDeleteTransaction, refetch, fetchTrashed,
  } = useTransactions()

  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"active" | "trash">("active")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [transactionToManage, setTransactionToManage] = useState<Transaction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (view === "trash") { fetchTrashed(); return }
    const t = setTimeout(() => refetch(searchTerm), 500)
    return () => clearTimeout(t)
  }, [view, searchTerm, fetchTrashed, refetch])

  const currentData = view === "active" ? transactions : trashedTransactions

  const handleCreate = () => { setSelectedTransaction(null); setIsModalOpen(true) }
  const handleEdit = (t: Transaction) => { setSelectedTransaction(t); setIsModalOpen(true) }
  const handleSuccess = () => { setIsModalOpen(false); refetch(searchTerm) }

  const runAction = async (fn: () => Promise<void>, closeDialog: () => void) => {
    setActionLoading(true)
    try { await fn(); closeDialog() }
    finally { setActionLoading(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Transaksi & Tagihan"
        subtitle="Pantau seluruh transaksi keuangan dan status pembayaran"
        badge="Keuangan"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm}
            searchPlaceholder="Cari nomor invoice atau pelanggan..."
            onCreate={handleCreate} createLabel="Buat Tagihan" createIcon={Plus}
            extraActions={<Button variant="outline" icon={RefreshCcw} size="sm" onClick={view === "active" ? () => refetch(searchTerm) : fetchTrashed} loading={loading}>Refresh</Button>}
          />
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total Pendapatan" value={formatRp(statistics?.total_revenue ?? 0)} icon={TrendingUp} loading={loading} color="emerald" />
        <StatCard label="DP Terkumpul" value={formatRp(statistics?.total_dp_collected ?? 0)} icon={Banknote} loading={loading} color="blue" />
        <StatCard label="Sisa Tagihan" value={formatRp(statistics?.total_outstanding ?? 0)} icon={Clock} loading={loading} color="amber" />
        <StatCard label="Lunas" value={statistics?.by_status.fully_paid ?? 0} icon={CheckCircle2} loading={loading} color="violet" />
      </div>

      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Aktif" trashLabel="Sampah" />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetch(searchTerm) : fetchTrashed} />
      ) : (
        <TransactionTable
          data={currentData} onDelete={t => { setTransactionToManage(t); setIsConfirmOpen(true) }}
          onEdit={handleEdit} onRestore={t => { setTransactionToManage(t); setIsRestoreConfirmOpen(true) }}
          onForceDelete={t => { setTransactionToManage(t); setIsForceDeleteConfirmOpen(true) }}
          loading={loading} isTrashed={view === "trash"}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedTransaction ? "Edit Transaksi" : "Buat Tagihan Baru"} subtitle="Detail tagihan dan pembayaran" size="xl">
        <TransactionForm transaction={selectedTransaction} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={() => runAction(() => deleteTransaction(transactionToManage!.id), () => { setIsConfirmOpen(false); setTransactionToManage(null) })} loading={actionLoading} title="Pindah ke Sampah?" message={`Invoice ${transactionToManage?.invoice_number} akan dipindahkan ke tempat sampah.`} variant="warning" confirmText="Ya, Pindahkan" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={() => runAction(() => restoreTransaction(transactionToManage!.id), () => { setIsRestoreConfirmOpen(false); setTransactionToManage(null) })} loading={actionLoading} title="Pulihkan Transaksi?" message={`Invoice ${transactionToManage?.invoice_number} akan dipulihkan.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={() => runAction(() => forceDeleteTransaction(transactionToManage!.id), () => { setIsForceDeleteConfirmOpen(false); setTransactionToManage(null) })} loading={actionLoading} variant="danger" title="Hapus Permanen?" message={`Invoice ${transactionToManage?.invoice_number} akan dihapus secara permanen.`} confirmText="Ya, Hapus" />
    </div>
  )
}
