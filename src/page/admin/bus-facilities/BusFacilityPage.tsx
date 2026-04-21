import { useState, useEffect } from "react"
import { useBusFacilities, useTrashedBusFacilities } from "@/features/admin/bus-facilities/hooks/useBusFacilities"
import BusFacilityTable from "@/features/admin/bus-facilities/components/BusFacilityTable"
import BusFacilityForm from "@/features/admin/bus-facilities/components/BusFacilityForm"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Search from "@/components/ui/Search"
import { Plus, RefreshCcw, Shield, ShieldAlert, List, History, Trash2 } from "lucide-react"
import Confirmation from "@/components/feedback/Confirmation"
import type { BusFacility } from "@/features/admin/bus-facilities/types/BusFacility"

export default function BusFacilityPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const [searchTerm, setSearchTerm] = useState("")
  
  const { 
    facilities, 
    statistics, 
    loading: activeLoading, 
    error: activeError, 
    deleteFacility,
    refetch: refetchActive 
  } = useBusFacilities()

  const { 
    facilities: trashedFacilities, 
    loading: trashLoading, 
    error: trashError,
    refetch: refetchTrash,
    restoreFacility,
    forceDeleteFacility 
  } = useTrashedBusFacilities()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<BusFacility | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [facilityToAction, setFacilityToAction] = useState<BusFacility | null>(null)

  // Server-side search with debounce for active view
  useEffect(() => {
    if (activeTab === 'all') {
      const timer = setTimeout(() => {
        refetchActive(searchTerm)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchTerm, activeTab, refetchActive])

  // Refetch trash when entering trash view
  useEffect(() => {
    if (activeTab === 'trash') {
      refetchTrash()
    }
  }, [activeTab, refetchTrash])

  const handleCreate = () => {
    setSelectedFacility(null)
    setIsModalOpen(true)
  }

  const handleEdit = (facility: BusFacility) => {
    setSelectedFacility(facility)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (facility: BusFacility) => {
    setFacilityToAction(facility)
    setIsDeleteConfirmOpen(true)
  }

  const handleRestoreClick = (id: string) => {
    const facility = trashedFacilities.find(f => f.id === id) || null
    setFacilityToAction(facility)
    setIsRestoreConfirmOpen(true)
  }

  const handleForceDeleteClick = (facility: BusFacility) => {
    setFacilityToAction(facility)
    setIsForceDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (facilityToAction) {
      await deleteFacility(facilityToAction.id)
      setIsDeleteConfirmOpen(false)
      setFacilityToAction(null)
      if (activeTab === 'trash') refetchTrash()
    }
  }

  const confirmRestore = async () => {
    if (facilityToAction) {
      await restoreFacility(facilityToAction.id)
      setIsRestoreConfirmOpen(false)
      setFacilityToAction(null)
      refetchActive(searchTerm)
    }
  }

  const confirmForceDelete = async () => {
    if (facilityToAction) {
      await forceDeleteFacility(facilityToAction.id)
      setIsForceDeleteConfirmOpen(false)
      setFacilityToAction(null)
    }
  }

  const stats = [
    { label: "Total Facilities", value: statistics?.total ?? 0, icon: Shield, note: "Available amenities" },
    { label: "Active", value: (statistics?.total ?? 0) - (statistics?.trashed ?? 0), icon: List, note: "Current offerings" },
    { label: "Trash", value: statistics?.trashed ?? 0, icon: History, note: "Deleted facilities" },
  ]

  const loading = activeTab === 'all' ? activeLoading : trashLoading
  const error = activeTab === 'all' ? activeError : trashError
  const displayData = activeTab === 'all' 
    ? facilities 
    : trashedFacilities.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin buses</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Bus Facilities</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search facilities..." 
            />
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List size={14} className="mr-1.5" />
                All
              </button>
              <button
                onClick={() => setActiveTab('trash')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                  activeTab === 'trash' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Trash2 size={14} className="mr-1.5" />
                Trash
              </button>
            </div>
            <Button variant="outline" icon={RefreshCcw} onClick={activeTab === 'all' ? () => refetchActive(searchTerm) : refetchTrash} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              New Facility
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={activeTab === 'all' ? () => refetchActive(searchTerm) : refetchTrash}>Try Again</Button>
            </div>
          </div>
        ) : (
          <BusFacilityTable 
            data={displayData} 
            loading={loading}
            isTrash={activeTab === 'trash'}
            onEdit={handleEdit}
            onDelete={activeTab === 'all' ? handleDeleteClick : handleForceDeleteClick}
            onRestore={handleRestoreClick}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedFacility ? "Edit Facility" : "Add New Facility"}>
        <BusFacilityForm facility={selectedFacility} onSuccess={() => { setIsModalOpen(false); refetchActive(searchTerm); refetchTrash(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Facility?" message={`Are you sure you want to delete "${facilityToAction?.name}"? It will be moved to the trash.`} variant="danger" confirmText="Yes, Delete" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={confirmRestore} title="Restore Facility?" message={`Restore "${facilityToAction?.name}" back to the active list?`} variant="info" confirmText="Yes, Restore" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={confirmForceDelete} title="Permanently Delete?" message={`This action cannot be undone. "${facilityToAction?.name}" will be permanently removed.`} variant="danger" confirmText="Yes, Permanently Delete" />
    </div>
  )
}
