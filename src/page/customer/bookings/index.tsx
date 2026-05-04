import { useNavigate } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { useBookings } from '@/features/customer/bookings/hooks/useBookings';
import BookingList from '@/features/customer/bookings/components/BookingList';
import Button from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Section, Container } from '@/components/ui/PageComponents';
import { Plus } from 'lucide-react';

export default function BookingIndexPage() {
  const { bookings, loading, error, refresh } = useBookings();
  const navigate = useNavigate();

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
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Riwayat <span className="text-orange-600">Pemesanan</span>
              </h1>
              <p className="max-w-xl text-lg font-medium text-slate-500">
                Pantau status pemesanan bus Anda dan kelola dokumen perjalanan secara mandiri.
              </p>
            </div>
            <Button 
              icon={Plus} 
              onClick={() => navigate('/customer/bookings/request')}
              className="w-full sm:w-auto"
            >
              Pesan Baru
            </Button>
          </div>

          {error ? (
            <ErrorState message={error} onRetry={refresh} />
          ) : (
            <BookingList bookings={bookings} />
          )}
        </Container>
      </Section>
    </PublicLayout>
  );
}
