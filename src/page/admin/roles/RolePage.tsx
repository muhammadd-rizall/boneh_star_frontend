import { useState, useMemo } from "react"
import { RoleTable, RoleForm, useRoles, type Role } from "@/features/admin/roles"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import { PageHeader, StatCard, StatGrid, PageToolbar, ErrorBanner } from "@/components/ui/PageComponents"
import { Plus, RefreshCcw, ShieldCheck, Key, Lock } from "lucide-react"

export default function RolePage() {
  const { roles, statistics, permissions, loading, error, deleteRole, refetch } = useRoles()
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredRoles = useMemo(
    () => roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [roles, searchTerm]
  )

  const handleSuccess = () => { setIsModalOpen(false); refetch() }
  const handleConfirmDelete = async () => {
    if (!roleToDelete) return; setDeleteLoading(true)
    try { await deleteRole(roleToDelete.id); setIsConfirmOpen(false); setRoleToDelete(null) }
    finally { setDeleteLoading(false) }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Role & Akses"
        subtitle="Kelola tingkat akses dan izin pengguna sistem"
        badge="Keamanan"
        actions={
          <PageToolbar
            searchValue={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Cari role..."
            onCreate={() => { setSelectedRole(null); setIsModalOpen(true) }} createLabel="Buat Role" createIcon={Plus}
            extraActions={<Button variant="outline" icon={RefreshCcw} size="sm" onClick={refetch} loading={loading}>Refresh</Button>}
          />
        }
      />

      <StatGrid columns={3}>
        <StatCard label="Total Role" value={statistics?.total_roles ?? roles.length} icon={ShieldCheck} loading={loading} />
        <StatCard label="Role Aktif" value={statistics?.active_roles ?? roles.filter(r => r.is_active).length} icon={Key} loading={loading} color="emerald" />
        <StatCard label="Total Izin" value={statistics?.total_permissions ?? Object.values(permissions).flat().length} icon={Lock} loading={loading} color="violet" />
      </StatGrid>

      {error ? (
        <ErrorBanner error={error} onRetry={refetch} />
      ) : (
        <RoleTable
          data={filteredRoles}
          onDelete={r => { setRoleToDelete(r); setIsConfirmOpen(true) }}
          onEdit={r => { setSelectedRole(r); setIsModalOpen(true) }}
          loading={loading}
        />
      )}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRole ? "Edit Hak Akses Role" : "Buat Role Baru"} subtitle="Atur izin dan tingkat akses pengguna" size="lg">
        <RoleForm role={selectedRole} availablePermissions={permissions} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} loading={deleteLoading} variant="danger" title="Hapus Role?" message={`Role "${roleToDelete?.name}" akan dihapus. Pengguna dengan role ini mungkin akan kehilangan akses.`} confirmText="Ya, Hapus" />
    </div>
  )
}
