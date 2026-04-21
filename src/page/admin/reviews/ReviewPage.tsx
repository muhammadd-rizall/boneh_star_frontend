import { useState } from "react"
import { 
  ReviewTable, 
  useReviews, 
  useTrashedReviews,
  type Review 
} from "@/features/admin/reviews"
import Button from "@/components/ui/Button"
import { PageHeader, StatCard, ViewToggle, PageToolbar, ErrorBanner } from "@/components/ui/PageComponents"
import { Star, MessageSquare, CheckCircle, EyeOff, RefreshCcw } from "lucide-react"
import Confirmation from "@/components/feedback/Confirmation"

export default function ReviewPage() {
  const [view, setView] = useState<'active' | 'trash'>('active')
  const { 
    reviews, 
    statistics, 
    loading: activeLoading, 
    error, 
    refetch, 
    togglePublishReview,
    deleteReview,
    page,
    setPage,
    meta
  } = useReviews()
  
  const { 
    reviews: trashedReviews, 
    loading: trashLoading, 
    refetch: refetchTrash,
    restoreReview,
    forceDeleteReview 
  } = useTrashedReviews()

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)
  const [isForceDeleteConfirmOpen, setIsForceDeleteConfirmOpen] = useState(false)
  const [reviewToAction, setReviewToAction] = useState<Review | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const runAction = async (fn: () => Promise<void>, closeDialog: () => void) => {
    setActionLoading(true)
    try { await fn(); closeDialog() }
    finally { setActionLoading(false) }
  }

  const handleTogglePublish = async (review: Review) => {
    try {
      await togglePublishReview(review.id)
    } catch (err) {
      console.error("Failed to toggle publish status:", err)
    }
  }

  const loading = view === 'active' ? activeLoading : trashLoading

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Ulasan Pelanggan"
        subtitle="Monitor dan kelola masukan dari pelanggan"
        badge="Feedback"
        actions={
          <PageToolbar
            searchValue="" onSearchChange={() => {}} 
            searchPlaceholder="Cari ulasan..."
            extraActions={
              <Button variant="outline" icon={RefreshCcw} size="sm" onClick={view === 'active' ? refetch : refetchTrash} loading={loading}>
                Refresh
              </Button>
            }
          />
        }
      />

      {statistics && view === 'active' && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Rating Rata-rata" value={`${statistics.cards.average_rating} / 5.0`} icon={Star} color="amber" loading={activeLoading} />
          <StatCard label="Total Ulasan" value={statistics.cards.total_count} icon={MessageSquare} color="blue" loading={activeLoading} />
          <StatCard label="Dipublikasi" value={statistics.cards.published_count} icon={CheckCircle} color="emerald" loading={activeLoading} />
          <StatCard label="Disembunyikan" value={statistics.cards.unpublished_count} icon={EyeOff} color="rose" loading={activeLoading} />
        </div>
      )}

      <div className="flex justify-end">
        <ViewToggle 
          view={view} 
          onViewChange={setView} 
          activeLabel="Semua Ulasan" 
          trashLabel="Sampah" 
        />
      </div>

      {error ? (
        <ErrorBanner error={error} onRetry={view === 'active' ? refetch : refetchTrash} />
      ) : (
        <div className="rounded-[24px] border border-slate-200 bg-white overflow-hidden shadow-sm">
            {view === 'active' ? (
            <>
                <ReviewTable 
                data={reviews} 
                loading={activeLoading}
                onTogglePublish={handleTogglePublish}
                onDelete={r => { setReviewToAction(r); setIsDeleteConfirmOpen(true) }}
                />
                {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
                    <Button size="sm" variant="ghost" disabled={page === 1} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
                    <span className="text-sm font-medium text-slate-500">Halaman {page} dari {meta.last_page}</span>
                    <Button size="sm" variant="ghost" disabled={page === meta.last_page} onClick={() => setPage(page + 1)}>Berikutnya</Button>
                </div>
                )}
            </>
            ) : (
            <ReviewTable 
                data={trashedReviews} 
                loading={trashLoading}
                isTrash
                onTogglePublish={() => {}} 
                onDelete={r => { setReviewToAction(r); setIsForceDeleteConfirmOpen(true) }}
                onRestore={id => { 
                    const r = trashedReviews.find(f => f.id === id) || null;
                    setReviewToAction(r); 
                    setIsRestoreConfirmOpen(true) 
                }}
            />
            )}
        </div>
      )}

      <Confirmation open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={() => runAction(async () => { await deleteReview(reviewToAction!.id); refetchTrash() }, () => setIsDeleteConfirmOpen(false))} loading={actionLoading} title="Hapus Ulasan?" message="Ulasan akan dipindahkan ke tempat sampah." variant="warning" confirmText="Ya, Hapus" />
      <Confirmation open={isRestoreConfirmOpen} onClose={() => setIsRestoreConfirmOpen(false)} onConfirm={() => runAction(async () => { await restoreReview(reviewToAction!.id); refetch() }, () => setIsRestoreConfirmOpen(false))} loading={actionLoading} title="Pulihkan Ulasan?" message="Ulasan akan dikembalikan ke daftar aktif." variant="info" confirmText="Ya, Pulihkan" />
      <Confirmation open={isForceDeleteConfirmOpen} onClose={() => setIsForceDeleteConfirmOpen(false)} onConfirm={() => runAction(async () => { await forceDeleteReview(reviewToAction!.id) }, () => setIsForceDeleteConfirmOpen(false))} loading={actionLoading} variant="danger" title="Hapus Permanen?" message="Tindakan ini tidak dapat dibatalkan." confirmText="Ya, Hapus" />
    </div>
  )
}
