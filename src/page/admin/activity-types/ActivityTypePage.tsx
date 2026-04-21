import { useState, useEffect } from "react"
// Explicit import trigger
import { 
  ActivityTypeTable, 
  ActivityTypeForm, 
  useActivityTypes,
  useTrashedActivityTypes,
  type ActivityType 
} from "@/features/admin/activity-types"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Search from "@/components/ui/Search"
import { Plus, RefreshCcw, Tag, ShieldAlert, List, History, Trash2 } from "lucide-react"
import Confirmation from "@/components/feedback/Confirmation"

export default function ActivityTypePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const [searchTerm, setSearchTerm] = useState("")
  
  const { 
    activityTypes, 
    statistics, 
    loading: activeLoading, 
    error: activeError, 
    deleteActivityType,
    refetch: refetchActive 
  } = useActivityTypes()

  const { 
    activityTypes: trashedActivityTypes, 
    loading: trashLoading, 
    error: trashError,
    refetch: refetchTrash,
    restoreActivityType,
    forceDeleteActivityType 
  } = useTrashedActivityTypes()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActivityType, setSelectedActivityType] = useState<ActivityType | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [activityTypeToAction, setActivityTypeToAction] = useState<ActivityType | null>(null)

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
    setSelectedActivityType(null)
    setIsModalOpen(true)
  }

  const handleEdit = (activityType: ActivityType) => {
    setSelectedActivityType(activityType)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (activityType: ActivityType) => {
    setActivityTypeToAction(activityType)
    setIsDeleteConfirmOpen(true)
  }

  const handleRestoreClick = (id: string) => {
    const activityType = trashedActivityTypes.find(f => f.id === id) || null
    setActivityTypeToAction(activityType)
    setIsRestoreConfirmOpen(true)
  }

  const handleForceDeleteClick = (activityType: ActivityType) => {
    setActivityTypeToAction(activityType)
    setIsForceDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (activityTypeToAction) {
      await deleteActivityType(activityTypeToAction.id)
      setIsDeleteConfirmOpen(false)
      setActivityTypeToAction(null)
      if (activeTab === 'trash') refetchTrash()
    }
  }

  const confirmRestore = async () => {
    if (activityTypeToAction) {
      await restoreActivityType(activityTypeToAction.id)
      setIsRestoreConfirmOpen(false)
      setActivityTypeToAction(null)
      refetchActive(searchTerm)
    }
  }

  const confirmForceDelete = async () => {
    if (activityTypeToAction) {
      await forceDeleteActivityType(activityTypeToAction.id)
      setIsForceDeleteConfirmOpen(false)
      setActivityTypeToAction(null)
    }
  }

  const stats = [
    { label: "Total Types", value: statistics?.total ?? 0, icon: Tag, note: "Total activity categories" },
    { label: "Active", value: (statistics?.total ?? 0) - (statistics?.trashed ?? 0), icon: List, note: "Ready to use" },
    { label: "Trash", value: statistics?.trashed ?? 0, icon: History, note: "Deleted activity types" },
  ]

  const loading = activeTab === 'all' ? activeLoading : trashLoading
  const error = activeTab === 'all' ? activeError : trashError
  const displayData = activeTab === 'all' 
    ? activityTypes 
    : trashedActivityTypes.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin activities</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Activity Types</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search activity types..." 
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
              New Type
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
          <ActivityTypeTable 
            data={displayData} 
            loading={loading}
            isTrash={activeTab === 'trash'}
            onEdit={handleEdit}
            onDelete={activeTab === 'all' ? handleDeleteClick : handleForceDeleteClick}
            onRestore={handleRestoreClick}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedActivityType ? "Edit Activity Type" : "Create Activity Type"}>
        <ActivityTypeForm activityType={selectedActivityType} onSuccess={() => { setIsModalOpen(false); refetchActive(searchTerm); refetchTrash(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Activity Type?" message={`Are you sure you want to delete "${activityTypeToAction?.name}"? It will be moved to the trash.`} variant="danger" confirmText="Yes, Delete" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={confirmRestore} title="Restore Activity Type?" message={`Restore "${activityTypeToAction?.name}" back to the active list?`} variant="info" confirmText="Yes, Restore" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={confirmForceDelete} title="Permanently Delete?" message={`This action cannot be undone. "${activityTypeToAction?.name}" will be permanently removed.`} variant="danger" confirmText="Yes, Permanently Delete" />
    </div>
  )
}
