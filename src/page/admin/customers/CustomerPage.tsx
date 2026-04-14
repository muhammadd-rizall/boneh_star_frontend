import { useState } from "react"
import { 
  CustomerTable, 
  CustomerForm, 
  useCustomers,
  type Customer 
} from "@/features/admin/customers"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import { Plus, RefreshCcw, Users, UserCheck, UserPlus, Heart, ShieldAlert, UserMinus } from "lucide-react"

export default function CustomerPage() {
  const { customers, statistics, loading, error, deleteCustomer, refetch } = useCustomers()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

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
    refetch()
  }

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return
    setDeleteLoading(true)
    try {
      await deleteCustomer(customerToDelete.id)
      setIsConfirmOpen(false)
      setCustomerToDelete(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const stats = [
    { 
      label: "Total Customers", 
      value: statistics?.cards.total ?? 0, 
      icon: Users, 
      note: "Total registered customers" 
    },
    { 
      label: "Active Customers", 
      value: statistics?.cards.active ?? 0, 
      icon: UserCheck, 
      note: "Currently active accounts" 
    },
    { 
      label: "New Members", 
      value: statistics?.cards.new_members ?? 0, 
      icon: UserPlus, 
      note: "Joined in the last 30 days" 
    },
    { 
      label: "Loyal Customers", 
      value: statistics?.cards.loyal_customers ?? 0, 
      icon: Heart, 
      note: "3+ completed bookings" 
    },
  ]

  const accountStats = [
    { label: "Active Accounts", value: statistics?.account_status.active ?? 0, icon: UserCheck, color: "text-emerald-600" },
    { label: "Inactive Accounts", value: statistics?.account_status.inactive ?? 0, icon: UserMinus, color: "text-rose-600" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin customers</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Customer Management</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Manage your customers, monitor their activities, and handle account statuses.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create Customer
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
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Live</span>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {loading ? "..." : stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-6">
          {accountStats.map((aStat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 ${aStat.color}`}>
                <aStat.icon size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{aStat.label}</p>
                <p className="text-sm font-semibold text-slate-700">{loading ? "..." : aStat.value}</p>
              </div>
            </div>
          ))}
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
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={refetch}>Try Again</Button>
            </div>
          </div>
        ) : (
          <CustomerTable 
            data={customers} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit}
            loading={loading} 
          />
        )}
      </div>

      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedCustomer ? "Update Customer" : "Register New Customer"}
      >
        <CustomerForm 
          customer={selectedCustomer} 
          onSuccess={handleSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

      <Confirmation
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Confirm Deletion"
        message={`Are you sure you want to delete customer ${customerToDelete?.name}? This will move them to the trash.`}
      />
    </div>
  )
}
