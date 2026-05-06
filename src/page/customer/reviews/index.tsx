import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useReviews } from '@/features/customer/reviews/hooks/useReviews';
import Card from '@/components/ui/Card';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Star, MessageSquare } from 'lucide-react';
import { formatDate } from '@/utils/formatter';

export default function ReviewIndexPage() {
  const { reviews, loading, error, refresh } = useReviews();

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
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Riwayat <span className="text-orange-600">Ulasan</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Ulasan dan pengalaman perjalanan yang telah Anda bagikan.
        </p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center shadow-sm">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
            <MessageSquare className="text-slate-300" size={40} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Belum ada ulasan</h3>
          <p className="mt-1 text-sm text-slate-500">Selesaikan perjalanan Anda untuk mulai berbagi ulasan.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="flex flex-col gap-6 shadow-md shadow-slate-200/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? 'fill-amber-400' : 'text-slate-300'} />
                  ))}
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed italic flex-1">
                "{review.comment}"
              </p>
              <div className="border-t border-slate-50 pt-4 mt-auto">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pemesanan</p>
                <p className="text-xs font-bold text-slate-900">#{review.booking?.booking_code}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}
