import { useState } from "react"
import { 
  BusTable, 
  BusForm, 
  useBuses,
  type Bus 
} from "@/features/admin/buses"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import { Plus, RefreshCcw, Bus as BusIcon, ShieldCheck, ShieldAlert, Banknote, Users } from "lucide-react"

export default function BusPage() {
  const { buses, statistics, loading, error, deleteBus, refetch } = useBuses()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [busToDelete, setBusToDelete] = useState<Bus | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleCreate = () => {
    setSelectedBus(null)
    setIsModalOpen(true)
  }

  const handleEdit = (bus: Bus) => {
    setSelectedBus(bus)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    refetch()
  }

  const handleDeleteClick = (bus: Bus) => {
    setBusToDelete(bus)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!busToDelete) return
    setDeleteLoading(true)
    try {
      await deleteBus(busToDelete.id)
      setIsConfirmOpen(false)
      setBusToDelete(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const stats = [
    { 
      label: "Total Buses", 
      value: statistics?.cards.total ?? 0, 
      icon: BusIcon, 
      note: "Total buses in fleet" 
    },
    { 
      label: "Active Buses", 
      value: statistics?.cards.active ?? 0, 
      icon: ShieldCheck, 
      note: "Available for booking" 
    },
    { 
      label: "Avg. Price", 
      value: `Rp ${Number(statistics?.cards.average_price ?? 0).toLocaleString('id-ID')}`, 
      icon: Banknote, 
      note: "Average price per day" 
    },
    { 
      label: "Capacities", 
      value: Object.keys(statistics?.by_capacity ?? {}).length, 
      icon: Users, 
      note: "Different seat variations" 
    },
  ]

  const statusStats = [
    { label: "Ready to Use", value: statistics?.cards.active ?? 0, icon: ShieldCheck, color: "text-emerald-600" },
    { label: "Maintenance/Inactive", value: statistics?.cards.inactive ?? 0, icon: ShieldAlert, color: "text-rose-600" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Admin buses</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Bus Fleet Management</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Manage your bus fleet, monitor availability, and set pricing.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Add New Bus
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

        <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-6">
          {statusStats.map((sStat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 ${sStat.color}`}>
                <sStat.icon size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{sStat.label}</p>
                <p className="text-sm font-semibold text-slate-700">{loading ? "..." : sStat.value}</p>
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
          <BusTable 
            data={buses} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit}
            loading={loading} 
          />
        )}
      </div>

      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedBus ? "Update Bus Details" : "Add New Bus to Fleet"}
      >
        <BusForm 
          bus={selectedBus} 
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
        message={`Are you sure you want to delete bus ${busToDelete?.name}? This will move it to the trash.`}
      />
    </div>
  )
}
