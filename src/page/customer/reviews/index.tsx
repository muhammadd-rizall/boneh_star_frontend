import React, { useState } from 'react';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useReviews } from '@/features/customer/reviews/hooks/useReviews';
import { Card } from '@/components/ui/Card';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Star, MessageSquare, Edit2 } from 'lucide-react';
import { formatDate } from '@/utils/formatter';
import { Modal } from '@/components/ui/Modal';
import ReviewForm from '@/features/customer/reviews/components/ReviewForm';
import { useToastStore } from '@/store/useToastStore';
import type { CustomerReview } from '@/features/customer/reviews/types/Review';

export default function ReviewIndexPage() {
  const { reviews, loading, error, refresh, updateReview } = useReviews();
  const { showSuccess, showError } = useToastStore();
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-midnight-indigo sm:text-3xl">
          Riwayat <span className="text-action-blue">Ulasan</span>
        </h1>
        <p className="text-sm font-semibold text-slate-400">
          Ulasan dan pengalaman perjalanan yang telah Anda bagikan.
        </p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-20 text-center shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 border border-slate-100">
            <MessageSquare className="text-slate-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-midnight-indigo">Belum Ada Ulasan</h3>
          <p className="mt-1 text-xs font-semibold text-slate-400">Selesaikan perjalanan Anda untuk mulai berbagi ulasan.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="flex flex-col gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed italic flex-1">
                "{review.comment}"
              </p>
              <div className="flex items-center justify-between border-t border-slate-50 pt-4 mt-auto">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Pemesanan</p>
                  <p className="text-xs font-extrabold text-midnight-indigo">#{review.booking?.booking_code}</p>
                </div>
                <button
                  onClick={() => setEditingReview(review)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-pale-gray bg-white text-[11px] font-bold text-action-blue hover:bg-cloud-mist transition-colors cursor-pointer shadow-sm"
                >
                  <Edit2 size={11} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingReview && (
        <Modal 
          open={!!editingReview} 
          onClose={() => setEditingReview(null)} 
          title="Edit Ulasan"
        >
          <ReviewForm
            bookingId={editingReview.booking_id}
            initialRating={editingReview.rating}
            initialComment={editingReview.comment}
            onCancel={() => setEditingReview(null)}
            onSubmit={async (data) => {
              try {
                await updateReview(editingReview.id, {
                  rating: data.rating,
                  comment: data.comment
                });
                showSuccess('Ulasan Anda berhasil diperbarui');
                setEditingReview(null);
              } catch (err: any) {
                showError(err.response?.data?.message || err.message || 'Gagal mengubah ulasan');
              }
            }}
          />
        </Modal>
      )}
    </CustomerLayout>
  );
}
