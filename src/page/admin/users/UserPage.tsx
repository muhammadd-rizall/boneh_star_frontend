import { useState, useEffect } from "react"
import {
  UserTable,
  UserForm,
  useUsers,
  useTrashedUsers,
  type User,
} from "@/features/admin/users"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Confirmation from "@/components/feedback/Confirmation"
import {
  PageHeader,
  StatCard, StatGrid,
  ViewToggle,
  PageToolbar,
  ErrorBanner,
} from "@/components/ui/PageComponents"
import { Plus, RefreshCcw, Users, UserCheck, UserMinus, Trash2 } from "lucide-react"

export default function UserPage() {
  const [view, setView] = useState<"active" | "trash">("active")
  const [searchTerm, setSearchTerm] = useState("")

  const { users, statistics, loading: activeLoading, error: activeError, deleteUser, refetch: refetchActive } = useUsers()
  const { users: trashedUsers, loading: trashLoading, error: trashError, refetch: refetchTrash, restoreUser, forceDeleteUser } = useTrashedUsers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [userToManage, setUserToManage] = useState<User | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (view === "active") {
      const t = setTimeout(() => refetchActive(searchTerm), 500)
      return () => clearTimeout(t)
    }
  }, [searchTerm, view, refetchActive])

  useEffect(() => {
    if (view === "trash") refetchTrash()
  }, [view, refetchTrash])

  const handleCreate = () => { setSelectedUser(null); setIsModalOpen(true) }
  const handleEdit = (u: User) => { setSelectedUser(u); setIsModalOpen(true) }
  const handleSuccess = () => { setIsModalOpen(false); if (view === "active") refetchActive(searchTerm); else refetchTrash() }

  const handleDeleteClick = (u: User) => { setUserToManage(u); setIsDeleteConfirmOpen(true) }
  const handleConfirmDelete = async () => {
    if (!userToManage) return; setActionLoading(true)
    try { 
      await deleteUser(userToManage.id); 
      setIsDeleteConfirmOpen(false); 
      setUserToManage(null);
      refetchActive(searchTerm);
    }
    finally { setActionLoading(false) }
  }

  const handleRestoreClick = (id: string) => {
    const u = trashedUsers.find(x => x.id === id)
    if (u) { setUserToManage(u); setIsRestoreConfirmOpen(true) }
  }
  const handleConfirmRestore = async () => {
    if (!userToManage) return; setActionLoading(true)
    try { await restoreUser(userToManage.id); setIsRestoreConfirmOpen(false); setUserToManage(null); refetchActive(searchTerm) }
    finally { setActionLoading(false) }
  }

  const handleForceDeleteClick = (u: User) => { setUserToManage(u); setIsForceDeleteConfirmOpen(true) }
  const handleConfirmForceDelete = async () => {
    if (!userToManage) return; setActionLoading(true)
    try { 
      await forceDeleteUser(userToManage.id); 
      setIsForceDeleteConfirmOpen(false); 
      setUserToManage(null);
      refetchActive(searchTerm);
    }
    finally { setActionLoading(false) }
  }

  const loading = view === "active" ? activeLoading : trashLoading
  const error = view === "active" ? activeError : trashError
  const displayData = view === "active"
    ? users
    : trashedUsers.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      )

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Manajemen Pengguna"
        subtitle="Kelola akun dan hak akses seluruh pengguna sistem"
        badge="Pengguna"
        actions={
          <PageToolbar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Cari nama atau email..."
            onCreate={handleCreate}
            createLabel="Tambah Pengguna"
            createIcon={Plus}
            extraActions={
              <Button
                variant="outline"
                icon={RefreshCcw}
                size="sm"
                onClick={view === "active" ? () => refetchActive(searchTerm) : refetchTrash}
                loading={loading}
              >
                Refresh
              </Button>
            }
          />
        }
      />

      {/* ── Stats ── */}
      <StatGrid columns={4}>
        <StatCard label="Total Pengguna" value={statistics?.total ?? 0} icon={Users} loading={activeLoading} />
        <StatCard label="Akun Aktif" value={statistics?.active ?? 0} icon={UserCheck} loading={activeLoading} color="emerald" />
        <StatCard label="Tidak Aktif" value={statistics?.inactive ?? 0} icon={UserMinus} loading={activeLoading} color="amber" />
        <StatCard label="Tong Sampah" value={statistics?.trashed ?? 0} icon={Trash2} loading={activeLoading} color="rose" />
      </StatGrid>


      {/* ── View Toggle ── */}
      <div className="flex justify-end">
        <ViewToggle view={view} onViewChange={setView} activeLabel="Pengguna Aktif" trashLabel="Sampah" />
      </div>

      {/* ── Error / Table ── */}
      {error ? (
        <ErrorBanner error={error} onRetry={view === "active" ? () => refetchActive(searchTerm) : refetchTrash} />
      ) : (
        <UserTable
          data={displayData}
          onDelete={view === "active" ? handleDeleteClick : handleForceDeleteClick}
          onEdit={handleEdit}
          onRestore={handleRestoreClick}
          loading={loading}
          isTrash={view === "trash"}
        />
      )}

      {/* ── Modal ── */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? "Edit Pengguna" : "Daftarkan Pengguna Baru"}
        subtitle={selectedUser ? `Mengubah data pengguna ${selectedUser.name}` : "Lengkapi informasi akun pengguna"}
      >
        <UserForm user={selectedUser} onSuccess={handleSuccess} onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={handleConfirmDelete} loading={actionLoading} title="Pindah ke Tong Sampah?" message={`Pengguna "${userToManage?.name}" akan dipindahkan ke tong sampah.`} variant="warning" confirmText="Ya, Pindahkan" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={handleConfirmRestore} loading={actionLoading} title="Pulihkan Pengguna?" message={`Pengguna "${userToManage?.name}" akan dipulihkan ke data aktif.`} variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={handleConfirmForceDelete} loading={actionLoading} variant="danger" title="Hapus Permanen?" message={`Pengguna "${userToManage?.name}" akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.`} confirmText="Ya, Hapus Permanen" />
    </div>
  )
}
