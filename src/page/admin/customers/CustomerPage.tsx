import { useState, useEffect } from "react"
import { 
  CustomerTable, 
  CustomerForm, 
  useCustomers,
  useTrashedCustomers,
  type Customer 
} from "@/features/admin/customers"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Search from "@/components/ui/Search"
import Confirmation from "@/components/feedback/Confirmation"
import { Plus, RefreshCcw, Users, UserCheck, UserPlus, Heart, ShieldAlert, UserMinus, Trash2, List } from "lucide-react"

export default function CustomerPage() {
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [searchTerm, setSearchTerm] = useState("")
  
  const { 
    customers, 
    statistics, 
    loading: activeLoading, 
    error: activeError, 
    deleteCustomer, 
    refetch: refetchActive 
  } = useCustomers()

  const {
    customers: trashedCustomers,
    loading: trashLoading,
    error: trashError,
    refetch: refetchTrash,
    restoreCustomer,
    forceDeleteCustomer
  } = useTrashedCustomers()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  
  const [customerToManage, setCustomerToManage] = useState<Customer | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Server-side search with debounce for active view
  useEffect(() => {
    if (view === 'active') {
      const timer = setTimeout(() => {
        refetchActive(searchTerm)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchTerm, view, refetchActive])

  // Refetch trash when entering trash view
  useEffect(() => {
    if (view === 'trash') {
      refetchTrash()
    }
  }, [view, refetchTrash])

  const handleCreate = () => {
    setSelectedCustomer(null)
    setIsModalOpen(true)
  }

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    if (view === 'active') refetchActive(searchTerm)
    else refetchTrash()
  }

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToManage(customer)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!customerToManage) return
    setActionLoading(true)
    try {
      await deleteCustomer(customerToManage.id)
      setIsDeleteConfirmOpen(false)
      setCustomerToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestoreClick = (id: string) => {
    const customer = trashedCustomers.find(c => c.id === id)
    if (customer) {
      setCustomerToManage(customer)
      setIsRestoreConfirmOpen(true)
    }
  }

  const handleConfirmRestore = async () => {
    if (!customerToManage) return
    setActionLoading(true)
    try {
      await restoreCustomer(customerToManage.id)
      setIsRestoreConfirmOpen(false)
      setCustomerToManage(null)
      refetchActive(searchTerm)
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceDeleteClick = (customer: Customer) => {
    setCustomerToManage(customer)
    setIsForceDeleteConfirmOpen(true)
  }

  const handleConfirmForceDelete = async () => {
    if (!customerToManage) return
    setActionLoading(true)
    try {
      await forceDeleteCustomer(customerToManage.id)
      setIsForceDeleteConfirmOpen(false)
      setCustomerToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const stats = [
    { label: "Total Customers", value: statistics?.cards.total ?? 0, icon: Users, note: "Total registered customers" },
    { label: "Active Customers", value: statistics?.cards.active ?? 0, icon: UserCheck, note: "Currently active accounts" },
    { label: "New Members", value: statistics?.cards.new_members ?? 0, icon: UserPlus, note: "Joined in the last 30 days" },
    { label: "Loyal Customers", value: statistics?.cards.loyal_customers ?? 0, icon: Heart, note: "3+ completed bookings" },
  ]

  const accountStats = [
    { label: "Active Accounts", value: statistics?.account_status.active ?? 0, icon: UserCheck, color: "text-emerald-600" },
    { label: "Inactive Accounts", value: statistics?.account_status.inactive ?? 0, icon: UserMinus, color: "text-rose-600" },
  ]

  const loading = view === 'active' ? activeLoading : trashLoading
  const error = view === 'active' ? activeError : trashError
  const displayData = view === 'active' 
    ? customers 
    : trashedCustomers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin customers</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Customer Management</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search by name or email..." 
            />
            <Button variant="outline" icon={RefreshCcw} onClick={view === 'active' ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create Customer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 border-b border-slate-100 pb-6">
          {stats.map((stat, i) => (
            <div key={i} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                  <stat.icon size={20} />
                </div>
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live</span>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 truncate">
                {activeLoading ? "..." : stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-6 pt-1">
            {accountStats.map((aStat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 ${aStat.color}`}>
                  <aStat.icon size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{aStat.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{activeLoading ? "..." : aStat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-2xl bg-slate-100 p-1 w-fit">
            <button
              onClick={() => setView('active')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${view === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List size={14} />
              Active
            </button>
            <button
              onClick={() => setView('trash')}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${view === 'trash' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
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
                <span className="block text-xs font-semibold uppercase tracking-[0.18em]">Error Occurred</span>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={view === 'active' ? () => refetchActive(searchTerm) : refetchTrash}>Try Again</Button>
            </div>
          </div>
        ) : (
          <CustomerTable 
            data={displayData} 
            onDelete={view === 'active' ? handleDeleteClick : handleForceDeleteClick} 
            onEdit={handleEdit}
            onRestore={handleRestoreClick}
            loading={loading} 
            isTrash={view === 'trash'}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCustomer ? "Update Customer" : "Register New Customer"}>
        <CustomerForm customer={selectedCustomer} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        title="Move to Trash"
        message={`Are you sure you want to move customer ${customerToManage?.name} to trash?`}
      />

      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={handleConfirmRestore}
        loading={actionLoading}
        title="Restore Customer"
        message={`Are you sure you want to restore customer ${customerToManage?.name}?`}
      />

      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={handleConfirmForceDelete}
        loading={actionLoading}
        variant="danger"
        title="Permanently Delete"
        message={`WARNING: Are you sure you want to permanently delete customer ${customerToManage?.name}? This action cannot be undone.`}
      />
    </div>
  )
}
