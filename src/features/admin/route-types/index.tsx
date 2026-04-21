import { useState } from "react"
import { useRouteTypes, useTrashedRouteTypes } from "./hooks/useRouteTypes"
import RouteTypeTable from "./components/RouteTypeTable"
import RouteTypeForm from "./components/RouteTypeForm"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { Plus, List, History } from "lucide-react"
import ErrorState from "@/components/feedback/ErrorState"
import Confirmation from "@/components/feedback/Confirmation"
import type { RouteType } from "./types/RouteType"

export default function RouteTypesFeature() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const { routeTypes, statistics, loading, error, refetch, deleteRouteType } = useRouteTypes()
  const { 
    routeTypes: trashedRouteTypes, 
    loading: trashLoading, 
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
      try {
        await deleteRouteType(routeTypeToAction.id)
        setIsDeleteConfirmOpen(false)
        setRouteTypeToAction(null)
        if (activeTab === 'trash') refetchTrash()
      } catch (err) {
        console.error("Failed to delete:", err)
      }
    }
  }

  const confirmRestore = async () => {
    if (routeTypeToAction) {
      try {
        await restoreRouteType(routeTypeToAction.id)
        setIsRestoreConfirmOpen(false)
        setRouteTypeToAction(null)
        refetch()
      } catch (err) {
        console.error("Failed to restore:", err)
      }
    }
  }

  const confirmForceDelete = async () => {
    if (routeTypeToAction) {
      try {
        await forceDeleteRouteType(routeTypeToAction.id)
        setIsForceDeleteConfirmOpen(false)
        setRouteTypeToAction(null)
      } catch (err) {
        console.error("Failed to force delete:", err)
      }
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Stats */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Route Types</h1>
          <p className="text-sm text-slate-500 font-medium">Manage scope and types of routes</p>
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
              <span>All Types</span>
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
            New Route Type
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-sm ring-1 ring-slate-200/50">
        {activeTab === 'all' ? (
          <RouteTypeTable 
            data={routeTypes} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ) : (
          <RouteTypeTable 
            data={trashedRouteTypes} 
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
        title={selectedRouteType ? "Edit Route Type" : "Create Route Type"}
      >
        <RouteTypeForm
          routeType={selectedRouteType}
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
        title="Delete Route Type?"
        message={`Are you sure you want to delete "${routeTypeToAction?.name}"? It will be moved to the trash.`}
        variant="danger"
        confirmText="Yes, Delete"
      />

      {/* Restore Confirmation */}
      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={confirmRestore}
        title="Restore Route Type?"
        message={`Restore "${routeTypeToAction?.name}" back to the active list?`}
        variant="info"
        confirmText="Yes, Restore"
      />

      {/* Force Delete Confirmation */}
      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={confirmForceDelete}
        title="Permanently Delete?"
        message={`This action cannot be undone. "${routeTypeToAction?.name}" will be permanently removed from the database.`}
        variant="danger"
        confirmText="Yes, Permanently Delete"
      />
    </div>
  )
}
