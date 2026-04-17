import { useState, useMemo, useEffect } from "react"
import { 
  TransactionTable, 
  TransactionForm, 
  useTransactions,
  type Transaction 
} from "@/features/admin/transactions"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Search from "@/components/ui/Search"
import Confirmation from "@/components/feedback/Confirmation"
import { 
  Plus, 
  RefreshCcw, 
  Receipt, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ShieldAlert,
  Banknote,
  TrendingUp,
  Trash2,
  List
} from "lucide-react"

export default function TransactionPage() {
  const { 
    transactions, 
    trashedTransactions,
    statistics, 
    loading, 
    error, 
    deleteTransaction, 
    restoreTransaction, 
    forceDeleteTransaction,
    refetch,
    fetchTrashed 
  } = useTransactions()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [transactionToManage, setTransactionToManage] = useState<Transaction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [view, setView] = useState<'active' | 'trashed'>('active')

  useEffect(() => {
    if (view === 'trashed') {
      fetchTrashed()
    } else {
      refetch()
    }
  }, [view, fetchTrashed, refetch])

  const currentData = view === 'active' ? transactions : trashedTransactions

  const filteredTransactions = useMemo(() => {
    return currentData.filter(t => 
      t.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.booking?.customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [currentData, searchTerm])

  const handleCreate = () => {
    setSelectedTransaction(null)
    setIsModalOpen(true)
  }

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    refetch()
  }

  const handleDeleteClick = (transaction: Transaction) => {
    setTransactionToManage(transaction)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!transactionToManage) return
    setActionLoading(true)
    try {
      await deleteTransaction(transactionToManage.id)
      setIsConfirmOpen(false)
      setTransactionToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestoreClick = (transaction: Transaction) => {
    setTransactionToManage(transaction)
    setIsRestoreConfirmOpen(true)
  }

  const handleConfirmRestore = async () => {
    if (!transactionToManage) return
    setActionLoading(true)
    try {
      await restoreTransaction(transactionToManage.id)
      setIsRestoreConfirmOpen(false)
      setTransactionToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceDeleteClick = (transaction: Transaction) => {
    setTransactionToManage(transaction)
    setIsForceDeleteConfirmOpen(true)
  }

  const handleConfirmForceDelete = async () => {
    if (!transactionToManage) return
    setActionLoading(true)
    try {
      await forceDeleteTransaction(transactionToManage.id)
      setIsForceDeleteConfirmOpen(false)
      setTransactionToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    { label: "Total Revenue", value: formatCurrency(statistics?.total_revenue ?? 0), icon: TrendingUp, note: "From fully paid invoices" },
    { label: "DP Collected", value: formatCurrency(statistics?.total_dp_collected ?? 0), icon: Banknote, note: "Total down payments" },
    { label: "Outstanding", value: formatCurrency(statistics?.total_outstanding ?? 0), icon: Clock, note: "Remaining to be paid" },
    { label: "Fully Paid", value: statistics?.by_status.fully_paid ?? 0, icon: CheckCircle, note: "Completed transactions" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Financial management</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Transaction & Billing</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search by invoice or customer..." 
            />
            <Button variant="outline" icon={RefreshCcw} onClick={view === 'active' ? refetch : fetchTrashed} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create Invoice
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                  <stat.icon size={20} />
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Real-time</span>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {loading ? "..." : stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => setView('active')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${view === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={14} />
              Active
            </button>
            <button
              onClick={() => setView('trashed')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${view === 'trashed' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Trash2 size={14} />
              Trash
            </button>
          </div>
        </div>
      </section>

      <div className="min-h-[400px]">
        {error ? (
          <div className="rounded-[28px] border border-slate-200/80 bg-white/90 p-12 text-center shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)]">
            <div className="mx-auto inline-flex max-w-md flex-col items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50 px-6 py-6 text-left text-rose-700">
              <ShieldAlert size={36} />
              <div className="space-y-1">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Data Error</span>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={view === 'active' ? refetch : fetchTrashed}>Try Again</Button>
            </div>
          </div>
        ) : (
          <TransactionTable 
            data={filteredTransactions} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit}
            onRestore={handleRestoreClick}
            onForceDelete={handleForceDeleteClick}
            loading={loading} 
            isTrashed={view === 'trashed'}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedTransaction ? "Update Transaction Details" : "Create New Billing"} size="xl">
        <TransactionForm transaction={selectedTransaction} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        title="Move to Trash"
        message={`Are you sure you want to move invoice ${transactionToManage?.invoice_number} to trash?`}
      />

      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={handleConfirmRestore}
        loading={actionLoading}
        title="Restore Transaction"
        message={`Are you sure you want to restore invoice ${transactionToManage?.invoice_number}?`}
      />

      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={handleConfirmForceDelete}
        loading={actionLoading}
        variant="danger"
        title="Permanently Delete"
        message={`WARNING: Are you sure you want to permanently delete invoice ${transactionToManage?.invoice_number}? This action cannot be undone.`}
      />
    </div>
  )
}
