import { useState } from "react"
import { Plus, RefreshCcw, Shield, Trash2, ShieldAlert } from "lucide-react"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import BusFacilityTable from "./components/BusFacilityTable"
import BusFacilityForm from "./components/BusFacilityForm"
import { useBusFacilities, useTrashedBusFacilities } from "./hooks/useBusFacilities"
import type { BusFacility } from "./types/BusFacility"

export default function BusFacilitiesFeature() {
  const { facilities, statistics, loading, error, deleteFacility, refetch } = useBusFacilities()
  const { 
    facilities: trashedFacilities, 
    loading: loadingTrashed, 
    restoreFacility, 
    forceDeleteFacility, 
    refetch: refetchTrashed 
  } = useTrashedBusFacilities()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isTrashOpen, setIsTrashOpen] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<BusFacility | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<BusFacility | null>(null)
  const [forceDeleteConfirm, setForceDeleteConfirm] = useState<BusFacility | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleEdit = (facility: BusFacility) => {
    setSelectedFacility(facility)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedFacility(null)
    setIsFormOpen(true)
  }

  const handleSuccess = () => {
    setIsFormOpen(false)
    refetch()
    refetchTrashed()
  }

  const handleDelete = async () => {
    if (deleteConfirm) {
      setDeleteLoading(true)
      try {
        await deleteFacility(deleteConfirm.id)
        setDeleteConfirm(null)
        refetchTrashed()
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  const handleRestore = async (id: string) => {
    await restoreFacility(id)
    refetch()
  }

  const handleForceDelete = async () => {
    if (forceDeleteConfirm) {
      setDeleteLoading(true)
      try {
        await forceDeleteFacility(forceDeleteConfirm.id)
        setForceDeleteConfirm(null)
      } finally {
        setDeleteLoading(false)
      }
    }
  }

  const stats = [
    { 
      label: "Total Facilities", 
      value: statistics?.total ?? 0, 
      icon: Shield, 
      note: "Total defined facilities" 
    },
    { 
      label: "Trashed Facilities", 
      value: statistics?.trashed ?? 0, 
      icon: Trash2, 
      note: "Facilities in trash" 
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin facilities</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Bus Facility Management</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Manage your bus facilities and equipment.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading}>
              Refresh
            </Button>
            <Button variant="outline" icon={Trash2} onClick={() => setIsTrashOpen(true)}>
              Trash Bin
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Add Facility
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <BusFacilityTable 
            data={facilities} 
            loading={loading} 
            onEdit={handleEdit} 
            onDelete={setDeleteConfirm} 
          />
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedFacility ? "Edit Facility" : "Add New Facility"}
      >
        <BusFacilityForm 
          facility={selectedFacility} 
          onSuccess={handleSuccess} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>

      {/* Trash Modal */}
      <Modal
        open={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        title="Trash Bin"
        size="lg"
      >
        <div className="flex flex-col gap-4">
          <BusFacilityTable 
            data={trashedFacilities} 
            loading={loadingTrashed} 
            onEdit={() => {}} 
            onDelete={setForceDeleteConfirm} 
            onRestore={handleRestore}
            isTrash={true}
          />
        </div>
      </Modal>

      {/* Confirmation Modals */}
      <Confirmation
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Facility"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will move it to the trash.`}
        variant="danger"
      />

      <Confirmation
        open={!!forceDeleteConfirm}
        onClose={() => setForceDeleteConfirm(null)}
        onConfirm={handleForceDelete}
        loading={deleteLoading}
        title="Permanently Delete"
        message={`Are you sure you want to permanently delete "${forceDeleteConfirm?.name}"? This action cannot be undone.`}
        variant="danger"
      />
    </div>
  )
}
