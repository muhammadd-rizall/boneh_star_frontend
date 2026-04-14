import { useState } from "react"
import { 
  RoleTable, 
  RoleForm, 
  useRoles,
  type Role 
} from "@/features/admin/roles"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import { Plus, RefreshCcw, ShieldCheck, ShieldAlert, Key } from "lucide-react"

export default function RolePage() {
  const { roles, permissions, loading, error, deleteRole, refetch } = useRoles()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleCreate = () => {
    setSelectedRole(null)
    setIsModalOpen(true)
  }

  const handleEdit = (role: Role) => {
    setSelectedRole(role)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setIsModalOpen(false)
    refetch()
  }

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return
    setDeleteLoading(true)
    try {
      await deleteRole(roleToDelete.id)
      setIsConfirmOpen(false)
      setRoleToDelete(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  const stats = [
    { label: "Total Roles", value: roles.length, icon: ShieldCheck, note: "Semua level akses" },
    { label: "Active Roles", value: roles.filter(r => r.is_active).length, icon: Key, note: "Role yang sedang dipakai" },
    { label: "Total Permissions", value: Object.values(permissions).flat().length, icon: ShieldAlert, note: "Hak akses yang tersedia" },
  ]

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Access control</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Roles & Permissions</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Atur level akses dan permission sistem dengan struktur visual yang lebih bersih dan mudah dipahami.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" icon={RefreshCcw} onClick={refetch} loading={loading}>
              Refresh
            </Button>
            <Button variant="primary" icon={Plus} onClick={handleCreate}>
              Create Role
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
                <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Global</span>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{loading ? "..." : stat.value}</p>
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
                <span className="block text-xs font-semibold uppercase tracking-[0.18em]">System Error</span>
                <p className="text-sm font-medium leading-relaxed">{error}</p>
              </div>
              <Button size="sm" variant="danger" className="mt-2 w-full" onClick={refetch}>Try Again</Button>
            </div>
          </div>
        ) : (
          <RoleTable 
            data={roles} 
            onDelete={handleDeleteClick} 
            onEdit={handleEdit}
            loading={loading} 
          />
        )}
      </div>

      {/* Form Modal */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? "Modify Role Permissions" : "Create New Access Role"}
        size="lg"
      >
        <RoleForm 
          role={selectedRole} 
          availablePermissions={permissions}
          onSuccess={handleSuccess} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

      <Confirmation
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Confirm Role Deletion"
        message={`Warning: Deleting the role "${roleToDelete?.name}" may affect users assigned to it. This action cannot be reversed.`}
      />
    </div>
  )
}
