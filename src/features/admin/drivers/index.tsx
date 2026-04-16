import { useState } from "react"
import { useDrivers, useTrashedDrivers } from "./hooks/useDrivers"
import DriverTable from "./components/DriverTable"
import DriverForm from "./components/DriverForm"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { Plus, Trash2, UserCircle, List, History, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import ErrorState from "@/components/feedback/ErrorState"
import Confirmation from "@/components/feedback/Confirmation"
import type { Driver } from "./types/Driver"

export default function DriversFeature() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const { drivers, statistics, loading, error, refetch, deleteDriver } = useDrivers()
  const { 
    drivers: trashedDrivers, 
    loading: trashLoading, 
    refetch: refetchTrash,
    restoreDriver,
    forceDeleteDriver 
  } = useTrashedDrivers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [driverToAction, setDriverToAction] = useState<Driver | null>(null)

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
      try {
        await deleteDriver(driverToAction.id)
        setIsDeleteConfirmOpen(false)
        setDriverToAction(null)
        if (activeTab === 'trash') refetchTrash()
      } catch (err) {
        console.error("Failed to delete:", err)
      }
    }
  }

  const confirmRestore = async () => {
    if (driverToAction) {
      try {
        await restoreDriver(driverToAction.id)
        setIsRestoreConfirmOpen(false)
        setDriverToAction(null)
        refetch()
      } catch (err) {
        console.error("Failed to restore:", err)
      }
    }
  }

  const confirmForceDelete = async () => {
    if (driverToAction) {
      try {
        await forceDeleteDriver(driverToAction.id)
        setIsForceDeleteConfirmOpen(false)
        setDriverToAction(null)
      } catch (err) {
        console.error("Failed to force delete:", err)
      }
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Stats Summary */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Drivers Management</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your company drivers and their availability</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'all' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={18} />
              <span>All Drivers</span>
              {statistics && (
                <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${
                  activeTab === 'all' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-600'
                }`}>
                  {statistics.total}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('trash')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                activeTab === 'trash' 
                  ? 'bg-white text-rose-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <History size={18} />
              <span>Trash</span>
              {statistics && statistics.trashed > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-lg text-[10px] ${
                  activeTab === 'trash' ? 'bg-rose-50 text-rose-600' : 'bg-slate-200 text-slate-600'
                }`}>
                  {statistics.trashed}
                </span>
              )}
            </button>
          </div>

          <Button variant="primary" icon={Plus} onClick={handleCreate}>
            New Driver
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {statistics && activeTab === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available</p>
              <p className="text-xl font-bold text-slate-900">{statistics.available}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">On Duty</p>
              <p className="text-xl font-bold text-slate-900">{statistics.on_duty}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-500 flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inactive</p>
              <p className="text-xl font-bold text-slate-900">{statistics.inactive}</p>
            </div>
          </div>
        </div>
      )}

      <Card className="overflow-hidden border-slate-200/60 shadow-sm ring-1 ring-slate-200/50">
        {activeTab === 'all' ? (
          <DriverTable 
            data={drivers} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ) : (
          <DriverTable 
            data={trashedDrivers} 
            loading={trashLoading}
            isTrash
            onEdit={() => {}} 
            onDelete={handleForceDeleteClick}
            onRestore={handleRestoreClick}
          />
        )}
      </Card>

      {/* Form Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedDriver ? "Edit Driver" : "Create Driver"}
        size="lg"
      >
        <DriverForm
          driver={selectedDriver}
          onSuccess={() => {
            setIsModalOpen(false)
            refetch()
            refetchTrash()
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Confirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Driver?"
        message={`Are you sure you want to delete "${driverToAction?.name}"? Driver will be moved to trash.`}
        variant="danger"
        confirmText="Yes, Delete"
      />

      {/* Restore Confirmation */}
      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={confirmRestore}
        title="Restore Driver?"
        message={`Restore "${driverToAction?.name}" back to active status?`}
        variant="info"
        confirmText="Yes, Restore"
      />

      {/* Force Delete Confirmation */}
      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={confirmForceDelete}
        title="Permanently Delete?"
        message={`This action cannot be undone. "${driverToAction?.name}" will be permanently removed.`}
        variant="danger"
        confirmText="Yes, Permanently Delete"
      />
    </div>
  )
}
