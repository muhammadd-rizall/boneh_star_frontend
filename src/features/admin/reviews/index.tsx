import { useState } from "react"
import { useReviews, useTrashedReviews } from "./hooks/useReviews"
import ReviewTable from "./components/ReviewTable"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { List, History, Star, MessageSquare, CheckCircle, EyeOff } from "lucide-react"
import ErrorState from "@/components/feedback/ErrorState"
import Confirmation from "@/components/feedback/Confirmation"
import type { Review } from "./types/Review"

export default function ReviewsFeature() {
  const [activeTab, setActiveTab] = useState<'all' | 'trash'>('all')
  const { 
    reviews, 
    statistics, 
    loading, 
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

  const handleTogglePublish = async (review: Review) => {
    try {
      await togglePublishReview(review.id)
    } catch (err) {
      console.error("Failed to toggle publish status:", err)
    }
  }

  const handleDeleteClick = (review: Review) => {
    setReviewToAction(review)
    setIsDeleteConfirmOpen(true)
  }

  const handleRestoreClick = (id: string) => {
    const review = trashedReviews.find(f => f.id === id) || null
    setReviewToAction(review)
    setIsRestoreConfirmOpen(true)
  }

  const handleForceDeleteClick = (review: Review) => {
    setReviewToAction(review)
    setIsForceDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (reviewToAction) {
      try {
        await deleteReview(reviewToAction.id)
        setIsDeleteConfirmOpen(false)
        setReviewToAction(null)
        refetchTrash()
      } catch (err) {
        console.error("Failed to delete:", err)
      }
    }
  }

  const confirmRestore = async () => {
    if (reviewToAction) {
      try {
        await restoreReview(reviewToAction.id)
        setIsRestoreConfirmOpen(false)
        setReviewToAction(null)
        refetch()
      } catch (err) {
        console.error("Failed to restore:", err)
      }
    }
  }

  const confirmForceDelete = async () => {
    if (reviewToAction) {
      try {
        await forceDeleteReview(reviewToAction.id)
        setIsForceDeleteConfirmOpen(false)
        setReviewToAction(null)
      } catch (err) {
        console.error("Failed to force delete:", err)
      }
    }
  }

  if (error) return <ErrorState message={error} onRetry={refetch} />

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900">Customer Reviews</h1>
          <p className="text-sm text-slate-500 font-medium">Monitor and manage customer feedback</p>
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
              <span>All Reviews</span>
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
            </button>
          </div>
        </div>
      </div>

      {statistics && activeTab === 'all' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="flex items-center gap-4 p-4 border-slate-200/60 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Star size={24} fill="currentColor" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Rating</p>
              <p className="text-lg font-bold text-slate-900">{statistics.cards.average_rating} / 5.0</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4 border-slate-200/60 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Reviews</p>
              <p className="text-lg font-bold text-slate-900">{statistics.cards.total_count}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4 border-slate-200/60 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Published</p>
              <p className="text-lg font-bold text-slate-900">{statistics.cards.published_count}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-4 border-slate-200/60 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-600">
              <EyeOff size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hidden</p>
              <p className="text-lg font-bold text-slate-900">{statistics.cards.unpublished_count}</p>
            </div>
          </Card>
        </div>
      )}

      <Card className="overflow-hidden border-slate-200/60 shadow-sm ring-1 ring-slate-200/50">
        {activeTab === 'all' ? (
          <>
            <ReviewTable 
              data={reviews} 
              loading={loading}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDeleteClick}
            />
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm font-medium text-slate-500">
                  Page {page} of {meta.last_page}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  disabled={page === meta.last_page}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <ReviewTable 
            data={trashedReviews} 
            loading={trashLoading}
            isTrash
            onTogglePublish={() => {}} 
            onDelete={handleForceDeleteClick}
            onRestore={handleRestoreClick}
          />
        )}
      </Card>

      {/* Delete Confirmation */}
      <Confirmation
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Review?"
        message="Are you sure you want to delete this review? It will be moved to the trash."
        variant="danger"
        confirmText="Yes, Delete"
      />

      {/* Restore Confirmation */}
      <Confirmation
        open={isRestoreConfirmOpen}
        onClose={() => setIsRestoreConfirmOpen(false)}
        onConfirm={confirmRestore}
        title="Restore Review?"
        message="Restore this review back to the active list?"
        variant="info"
        confirmText="Yes, Restore"
      />

      {/* Force Delete Confirmation */}
      <Confirmation
        open={isForceDeleteConfirmOpen}
        onClose={() => setIsForceDeleteConfirmOpen(false)}
        onConfirm={confirmForceDelete}
        title="Permanently Delete?"
        message="This action cannot be undone. This review will be permanently removed from the database."
        variant="danger"
        confirmText="Yes, Permanently Delete"
      />
    </div>
  )
}
