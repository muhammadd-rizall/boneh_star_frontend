import PublicLayout from '@/layouts/public/PublicLayout';
import { useReviews } from '@/features/customer/reviews/hooks/useReviews';
import Card from '@/components/ui/Card';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Section, Container } from '@/components/ui/PageComponents';
import { Star, MessageSquare } from 'lucide-react';
import { formatDate } from '@/utils/formatter';

export default function ReviewIndexPage() {
  const { reviews, loading, error, refresh } = useReviews();

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Section className="pt-32 pb-20">
        <Container>
          <div className="mb-10 flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Riwayat <span className="text-orange-600">Ulasan</span>
            </h1>
            <p className="text-lg font-medium text-slate-500">
              Daftar ulasan yang telah Anda berikan untuk perjalanan Anda.
            </p>
          </div>

          {error ? (
            <ErrorState message={error} onRetry={refresh} />
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <MessageSquare className="text-slate-300" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Belum ada ulasan</h3>
              <p className="mt-1 text-sm text-slate-500">Ulasan Anda akan muncul di sini setelah Anda menyelesaikan perjalanan.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
                <Card key={review.id} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < review.rating ? 'fill-amber-400' : 'text-slate-300'} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed italic flex-1">
                    "{review.comment}"
                  </p>
                  <div className="border-t border-slate-100 pt-3 mt-auto">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pemesanan</p>
                    <p className="text-xs font-bold text-slate-900">#{review.booking?.booking_code}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </PublicLayout>
  );
}
