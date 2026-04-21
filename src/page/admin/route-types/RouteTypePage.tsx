import { useState, useEffect } from "react"
import { useRouteTypes, useTrashedRouteTypes } from "@/features/admin/route-types/hooks/useRouteTypes"
import RouteTypeTable from "@/features/admin/route-types/components/RouteTypeTable"
import RouteTypeForm from "@/features/admin/route-types/components/RouteTypeForm"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Search from "@/components/ui/Search"
import { Plus, RefreshCcw, Map, ShieldAlert, List, History, Trash2 } from "lucide-react"
import Confirmation from "@/components/feedback/Confirmation"
import type { RouteType } from "@/features/admin/route-types/types/RouteType"

export default function RouteTypePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const [searchTerm, setSearchTerm] = useState("")
  
  const { 
    routeTypes, 
    statistics, 
    loading: activeLoading, 
    error: activeError, 
    deleteRouteType,
    refetch: refetchActive 
  } = useRouteTypes()

  const { 
    routeTypes: trashedRouteTypes, 
    loading: trashLoading, 
    error: trashError,
    refetch: refetchTrash,
    restoreRouteType,
    forceDeleteRouteType 
  } = useTrashedRouteTypes()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRouteType, setSelectedRouteType] = useState<RouteType | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [routeTypeToAction, setRouteTypeToAction] = useState<RouteType | null>(null)

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
    setSelectedRouteType(null)
    setIsModalOpen(true)
  }

  const handleEdit = (routeType: RouteType) => {
    setSelectedRouteType(routeType)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (routeType: RouteType) => {
    setRouteTypeToAction(routeType)
    setIsDeleteConfirmOpen(true)
  }

  const handleRestoreClick = (id: string) => {
    const routeType = trashedRouteTypes.find(f => f.id === id) || null
    setRouteTypeToAction(routeType)
    setIsRestoreConfirmOpen(true)
  }

  const handleForceDeleteClick = (routeType: RouteType) => {
    setRouteTypeToAction(routeType)
    setIsForceDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (routeTypeToAction) {
      await deleteRouteType(routeTypeToAction.id)
      setIsDeleteConfirmOpen(false)
      setRouteTypeToAction(null)
      if (activeTab === 'trash') refetchTrash()
    }
  }

  const confirmRestore = async () => {
    if (routeTypeToAction) {
      await restoreRouteType(routeTypeToAction.id)
      setIsRestoreConfirmOpen(false)
      setRouteTypeToAction(null)
      refetchActive(searchTerm)
    }
  }

  const confirmForceDelete = async () => {
    if (routeTypeToAction) {
      await forceDeleteRouteType(routeTypeToAction.id)
      setIsForceDeleteConfirmOpen(false)
      setRouteTypeToAction(null)
    }
  }

  const stats = [
    { label: "Total Routes", value: statistics?.total ?? 0, icon: Map, note: "Total route categories" },
    { label: "Active", value: (statistics?.total ?? 0) - (statistics?.trashed ?? 0), icon: List, note: "Used for trips" },
    { label: "Trash", value: statistics?.trashed ?? 0, icon: History, note: "Deleted route types" },
  ]

  const loading = activeTab === 'all' ? activeLoading : trashLoading
  const error = activeTab === 'all' ? activeError : trashError
  const displayData = activeTab === 'all' 
    ? routeTypes 
    : trashedRouteTypes.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin buses</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Route Types</h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Search 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Search route types..." 
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
              New Route Type
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
          <RouteTypeTable 
            data={displayData} 
            loading={loading}
            isTrash={activeTab === 'trash'}
            onEdit={handleEdit}
            onDelete={activeTab === 'all' ? handleDeleteClick : handleForceDeleteClick}
            onRestore={handleRestoreClick}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRouteType ? "Edit Route Type" : "Create Route Type"}>
        <RouteTypeForm routeType={selectedRouteType} onSuccess={() => { setIsModalOpen(false); refetchActive(searchTerm); refetchTrash(); }} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Route Type?" message={`Are you sure you want to delete "${routeTypeToAction?.name}"? It will be moved to the trash.`} variant="danger" confirmText="Yes, Delete" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={confirmRestore} title="Restore Route Type?" message={`Restore "${routeTypeToAction?.name}" back to the active list?`} variant="info" confirmText="Yes, Restore" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={confirmForceDelete} title="Permanently Delete?" message={`This action cannot be undone. "${routeTypeToAction?.name}" will be permanently removed.`} variant="danger" confirmText="Yes, Permanently Delete" />
    </div>
  )
}
