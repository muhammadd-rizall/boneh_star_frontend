import { useState } from "react"
import { useActivityTypes, useTrashedActivityTypes } from "./hooks/useActivityTypes"
import ActivityTypeTable from "./components/ActivityTypeTable"
import ActivityTypeForm from "./components/ActivityTypeForm"
import Modal from "@/components/ui/Modal"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import { Plus, Trash2, Tag, List, History } from "lucide-react"
import ErrorState from "@/components/feedback/ErrorState"
import Confirmation from "@/components/feedback/Confirmation"
import type { ActivityType } from "./types/ActivityType"

export default function ActivityTypesFeature() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const { activityTypes, statistics, loading, error, refetch, deleteActivityType } = useActivityTypes()
  const { 
    activityTypes: trashedActivityTypes, 
    loading: trashLoading, 
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
      try {
        await deleteActivityType(activityTypeToAction.id)
        setIsDeleteConfirmOpen(false)
        setActivityTypeToAction(null)
        if (activeTab === 'trash') refetchTrash()
      } catch (err) {
        console.error("Failed to delete:", err)
      }
    }
  }

  const confirmRestore = async () => {
    if (activityTypeToAction) {
      try {
        await restoreActivityType(activityTypeToAction.id)
        setIsRestoreConfirmOpen(false)
        setActivityTypeToAction(null)
        refetch()
      } catch (err) {
        console.error("Failed to restore:", err)
      }
    }
  }

  const confirmForceDelete = async () => {
    if (activityTypeToAction) {
      try {
        await forceDeleteActivityType(activityTypeToAction.id)
        setIsForceDeleteConfirmOpen(false)
        setActivityTypeToAction(null)
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
          <h1 className="text-2xl font-bold text-slate-900">Activity Types</h1>
          <p className="text-sm text-slate-500 font-medium">Manage types of activities for your tours</p>
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
            New Activity Type
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200/60 shadow-sm ring-1 ring-slate-200/50">
        {activeTab === 'all' ? (
          <ActivityTypeTable 
            data={activityTypes} 
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ) : (
          <ActivityTypeTable 
            data={trashedActivityTypes} 
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
        title={selectedActivityType ? "Edit Activity Type" : "Create Activity Type"}
      >
        <ActivityTypeForm
          activityType={selectedActivityType}
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
        title="Delete Activity Type?"
        message={`Are you sure you want to delete "${activityTypeToAction?.name}"? It will be moved to the trash.`}
        variant="danger"
        confirmText="Yes, Delete"
      />

      {/* Restore Confirmation */}
      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={confirmRestore}
        title="Restore Activity Type?"
        message={`Restore "${activityTypeToAction?.name}" back to the active list?`}
        variant="info"
        confirmText="Yes, Restore"
      />

      {/* Force Delete Confirmation */}
      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={confirmForceDelete}
        title="Permanently Delete?"
        message={`This action cannot be undone. "${activityTypeToAction?.name}" will be permanently removed from the database.`}
        variant="danger"
        confirmText="Yes, Permanently Delete"
      />
    </div>
  )
}
