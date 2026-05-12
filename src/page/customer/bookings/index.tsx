import { useNavigate } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useBookings } from '@/features/customer/bookings/hooks/useBookings';
import BookingList from '@/features/customer/bookings/components/BookingList';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Plus } from 'lucide-react';

export default function BookingIndexPage() {
  const { bookings, loading, error, refresh } = useBookings();
  const navigate = useNavigate();

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
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Riwayat <span className="text-orange-600">Pemesanan</span>
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Kelola dan pantau status pemesanan bus Anda.
          </p>
        </div>
        <Button 
          icon={Plus} 
          onClick={() => navigate('/customer/bookings/request')}
          className="w-full sm:w-auto shadow-lg shadow-slate-200"
        >
          Pesan Baru
        </Button>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <BookingList bookings={bookings} />
      )}
    </CustomerLayout>
  );
}
