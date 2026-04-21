import { useState, useEffect } from "react"
import { 
  DriverTable, 
  DriverForm, 
  useDrivers,
  useTrashedDrivers,
  type Driver 
} from "@/features/admin/drivers"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Search from "@/components/ui/Search"
import { Plus, RefreshCcw, UserCircle, ShieldAlert, CheckCircle2, History, Clock, AlertCircle, List, Trash2 } from "lucide-react"
import Confirmation from "@/components/feedback/Confirmation"

export default function DriverPage() {
  const [view, setView] = useState<'active' | 'trash'>('active');
  const [searchTerm, setSearchTerm] = useState("")
  
  const { 
    drivers, 
    statistics, 
    loading: activeLoading, 
    error: activeError, 
    deleteDriver, 
    refetch: refetchActive 
  } = useDrivers()

  const {
    drivers: trashedDrivers,
    loading: trashLoading,
    error: trashError,
    refetch: refetchTrash,
    restoreDriver,
    forceDeleteDriver
  } = useTrashedDrivers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  
  const [driverToManage, setDriverToManage] = useState<Driver | null>(null)
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
    setSelectedDriver(null)
    setIsModalOpen(true)
  }

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    if (view === 'active') refetchActive(searchTerm)
    else refetchTrash()
  }

  const handleDeleteClick = (driver: Driver) => {
    setDriverToManage(driver)
    setIsDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!driverToManage) return
    setActionLoading(true)
    try {
      await deleteDriver(driverToManage.id)
      setIsDeleteConfirmOpen(false)
      setDriverToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const handleRestoreClick = (id: string) => {
    const driver = trashedDrivers.find(d => d.id === id)
    if (driver) {
      setDriverToManage(driver)
      setIsRestoreConfirmOpen(true)
    }
  }

  const handleConfirmRestore = async () => {
    if (!driverToManage) return
    setActionLoading(true)
    try {
      await restoreDriver(driverToManage.id)
      setIsRestoreConfirmOpen(false)
      setDriverToManage(null)
      refetchActive(searchTerm)
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceDeleteClick = (driver: Driver) => {
    setDriverToManage(driver)
    setIsForceDeleteConfirmOpen(true)
  }

  const handleConfirmForceDelete = async () => {
    if (!driverToManage) return
    setActionLoading(true)
    try {
      await forceDeleteDriver(driverToManage.id)
      setIsForceDeleteConfirmOpen(false)
      setDriverToManage(null)
    } finally {
      setActionLoading(false)
    }
  }

  const stats = [
    { label: "Total Drivers", value: statistics?.total ?? 0, icon: UserCircle, note: "Registered drivers" },
    { label: "Available", value: statistics?.available ?? 0, icon: CheckCircle2, note: "Ready for duty" },
    { label: "On Duty", value: statistics?.on_duty ?? 0, icon: Clock, note: "Currently driving" },
    { label: "Inactive", value: statistics?.inactive ?? 0, icon: AlertCircle, note: "Off duty/Inactive" },
  ]

  const loading = view === 'active' ? activeLoading : trashLoading
  const error = view === 'active' ? activeError : trashError
  const displayData = view === 'active' 
    ? drivers 
    : trashedDrivers.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin drivers</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Drivers Management</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search by name or phone..." 
            />
            <Button variant="outline" icon={RefreshCcw} onClick={view === 'active' ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              New Driver
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
          <DriverTable 
            data={displayData} 
            onDelete={view === 'active' ? handleDeleteClick : handleForceDeleteClick} 
            onEdit={handleEdit}
            onRestore={handleRestoreClick}
            loading={loading} 
            isTrash={view === 'trash'}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDriver ? "Update Driver" : "Register New Driver"} size="lg">
        <DriverForm driver={selectedDriver} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        title="Move to Trash"
        message={`Are you sure you want to move driver "${driverToManage?.name}" to trash?`}
      />

      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={handleConfirmRestore}
        loading={actionLoading}
        title="Restore Driver"
        message={`Are you sure you want to restore driver "${driverToManage?.name}"?`}
      />

      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={handleConfirmForceDelete}
        loading={actionLoading}
        variant="danger"
        title="Permanently Delete"
        message={`WARNING: Are you sure you want to permanently delete driver "${driverToManage?.name}"? This action cannot be undone.`}
      />
    </div>
  )
}
