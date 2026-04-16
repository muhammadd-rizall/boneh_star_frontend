import { useState, useMemo } from "react"
import { useDrivers, useTrashedDrivers } from "@/features/admin/drivers/hooks/useDrivers"
import DriverTable from "@/features/admin/drivers/components/DriverTable"
import DriverForm from "@/features/admin/drivers/components/DriverForm"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Search from "@/components/ui/Search"
import { Plus, RefreshCcw, UserCircle, ShieldAlert, CheckCircle2, History, Clock, AlertCircle } from "lucide-react"
import Confirmation from "@/components/feedback/Confirmation"
import type { Driver } from "@/features/admin/drivers/types/Driver"

export default function DriverPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const { drivers, statistics, loading, error, refetch, deleteDriver } = useDrivers()
  const { 
    drivers: trashedDrivers, 
    loading: trashLoading, 
    refetch: refetchTrash,
    restoreDriver,
    forceDeleteDriver 
  } = useTrashedDrivers()

  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [driverToAction, setDriverToAction] = useState<Driver | null>(null)

  const filteredData = useMemo(() => {
    const source = activeTab === 'all' ? drivers : trashedDrivers
    return source.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [drivers, trashedDrivers, activeTab, searchTerm])

  const handleCreate = () => {
    setSelectedDriver(null)
    setIsModalOpen(true)
  }

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (driver: Driver) => {
    setDriverToAction(driver)
    setIsDeleteConfirmOpen(true)
  }

  const handleRestoreClick = (id: string) => {
    const driver = trashedDrivers.find(f => f.id === id) || null
    setDriverToAction(driver)
    setIsRestoreConfirmOpen(true)
  }

  const handleForceDeleteClick = (driver: Driver) => {
    setDriverToAction(driver)
    setIsForceDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (driverToAction) {
      await deleteDriver(driverToAction.id)
      setIsDeleteConfirmOpen(false)
      setDriverToAction(null)
      if (activeTab === 'trash') refetchTrash()
    }
  }

  const confirmRestore = async () => {
    if (driverToAction) {
      await restoreDriver(driverToAction.id)
      setIsRestoreConfirmOpen(false)
      setDriverToAction(null)
      refetch()
    }
  }

  const confirmForceDelete = async () => {
    if (driverToAction) {
      await forceDeleteDriver(driverToAction.id)
      setIsForceDeleteConfirmOpen(false)
      setDriverToAction(null)
    }
  }

  const stats = [
    { label: "Total Drivers", value: statistics?.total ?? 0, icon: UserCircle, note: "Registered drivers" },
    { label: "Available", value: statistics?.available ?? 0, icon: CheckCircle2, note: "Ready for duty" },
    { label: "On Duty", value: statistics?.on_duty ?? 0, icon: Clock, note: "Currently driving" },
    { label: "Inactive", value: statistics?.inactive ?? 0, icon: AlertCircle, note: "Off duty/Inactive" },
  ]

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
              placeholder="Search drivers by name..." 
            />
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('trash')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'trash' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Trash
              </button>
            </div>
            <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              New Driver
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
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 truncate">
                {loading ? "..." : stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.note}</p>
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
          <DriverTable 
            data={filteredData} 
            loading={activeTab === 'all' ? loading : trashLoading}
            isTrash={activeTab === 'trash'}
            onEdit={handleEdit}
            onDelete={activeTab === 'all' ? handleDeleteClick : handleForceDeleteClick}
            onRestore={handleRestoreClick}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDriver ? "Edit Driver" : "Register New Driver"} size="lg">
        <DriverForm driver={selectedDriver} onSuccess={() => { setIsModalOpen(false); refetch(); refetchTrash(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Driver?" message={`Are you sure you want to delete "${driverToAction?.name}"? Driver will be moved to trash.`} variant="danger" confirmText="Yes, Delete" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={confirmRestore} title="Restore Driver?" message={`Restore "${driverToAction?.name}" back to active status?`} variant="info" confirmText="Yes, Restore" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={confirmForceDelete} title="Permanently Delete?" message={`This action cannot be undone. "${driverToAction?.name}" will be permanently removed.`} variant="danger" confirmText="Yes, Permanently Delete" />
    </div>
  )
}
