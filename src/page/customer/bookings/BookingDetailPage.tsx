import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { useBookingDetail } from '@/features/customer/bookings/hooks/useBookings';
import { bookingService } from '@/features/customer/bookings/services/BookingService';
import BookingStatusBadge from '@/features/customer/bookings/components/BookingStatusBadge';
import QuotationSection from '@/features/customer/bookings/components/QuotationSection';
import PaymentSection from '@/features/customer/bookings/components/PaymentSection';
import ReviewForm from '@/features/customer/reviews/components/ReviewForm';
import { reviewService } from '@/features/customer/reviews/services/ReviewService';
import type { ReviewFormData } from '@/features/customer/reviews/types/Review';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Section, Container } from '@/components/ui/PageComponents';
import { Calendar, MapPin, Users, Bus, ArrowLeft, Info, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatter';
import type { PaymentMethod } from '@/types/Database';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    booking, 
    loading, 
    error, 
    refresh, 
    acceptQuotation, 
    reviseQuotation,
    cancelBooking 
  } = useBookingDetail(id!);

  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');

  React.useEffect(() => {
    bookingService.getPaymentMethods().then(setPaymentMethods);
  }, []);

  if (loading) return <PublicLayout><div className="flex h-[60vh] items-center justify-center"><Loader /></div></PublicLayout>;
  if (error || !booking) return <PublicLayout><div className="flex h-[60vh] items-center justify-center"><ErrorState message={error || 'Pemesanan tidak ditemukan'} onRetry={refresh} /></div></PublicLayout>;

  return (
    <PublicLayout>
      <Section className="pt-32 pb-20">
        <Container>
          {/* Header Actions */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={() => navigate('/customer/bookings')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft size={16} /> Kembali ke Riwayat
            </button>
            <div className="flex items-center gap-3">
              {['pending', 'quoted'].includes(booking.status) && (
                <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => setShowCancelModal(true)}>
                  Batalkan Pemesanan
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
            {/* Left Column: Details & Payments */}
            <div className="flex flex-col gap-10">
              {/* Main Info Card */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-black text-slate-900">#{booking.booking_code}</h1>
                    <BookingStatusBadge status={booking.status} />
                  </div>
                  <p className="text-sm font-medium text-slate-500">Pemesanan dibuat pada {formatDate(booking.created_at)}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailItem icon={Calendar} label="Jadwal Perjalanan" value={`${formatDate(booking.departure_date)} - ${formatDate(booking.return_date || '')}`} />
                  <DetailItem icon={MapPin} label="Titik Jemput & Rute" value={`${booking.origin} (${booking.full_route})`} />
                  <DetailItem icon={Users} label="Kapasitas" value={`${booking.passenger_count} Penumpang`} />
                  <DetailItem icon={Bus} label="Jumlah Armada" value={`${booking.bus_count_requested} Bus Requested`} />
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start gap-3">
                    <Info size={16} className="mt-0.5 text-slate-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Catatan Tambahan</p>
                      <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">{booking.special_notes || 'Tidak ada catatan khusus.'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quotation Section */}
              {booking.quotation && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Penawaran Harga</h2>
                  <QuotationSection 
                    quotation={booking.quotation} 
                    onAccept={() => acceptQuotation(booking.quotation!.id)} 
                    onRevise={(note) => reviseQuotation(booking.quotation!.id, note)}
                  />
                </div>
              )}

              {/* Payment Section */}
              {booking.transaction && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Pembayaran</h2>
                  <PaymentSection 
                    transaction={booking.transaction} 
                    paymentMethods={paymentMethods}
                    onUpload={(data) => bookingService.uploadPayment(booking.id, data).then(refresh)}
                  />
                </div>
              )}

              {/* Review Section */}
              {booking.status === 'completed' && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Ulasan Perjalanan</h2>
                  <Card>
                    <ReviewForm 
                      bookingId={booking.id} 
                      onCancel={() => {}} 
                      onSubmit={async (data: ReviewFormData) => {
                        await reviewService.create(data);
                        refresh();
                      }}
                    />
                  </Card>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar info/Summary */}
            <div className="flex flex-col gap-6">
              <Card className="flex flex-col gap-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Ringkasan Kegiatan</h3>
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{booking.activity?.name}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <SummaryRow label="Tipe Rute" value={booking.route_type?.name || '-'} />
                  <SummaryRow label="Status" value={<BookingStatusBadge status={booking.status} />} />
                  {booking.transaction && (
                    <>
                      <div className="my-2 border-t border-dashed border-slate-100" />
                      <SummaryRow label="Total Biaya" value={<span className="font-black text-slate-900">{formatCurrency(booking.transaction.total_amount)}</span>} />
                      <SummaryRow label="Tersisa" value={<span className="font-bold text-orange-600">{formatCurrency(booking.transaction.remaining_amount)}</span>} />
                    </>
                  )}
                </div>
              </Card>

              {booking.status === 'cancelled' && (
                <Card className="bg-rose-50 border-rose-100">
                  <p className="text-xs font-bold text-rose-800 uppercase tracking-widest">Alasan Pembatalan:</p>
                  <p className="mt-2 text-xs font-medium text-rose-600 leading-relaxed italic">"{booking.cancelled_reason}"</p>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Simple Cancel Modal Integration (Mockup as it requires a real Modal component) */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-slate-900">Batalkan Pemesanan?</h3>
            <p className="mt-2 text-sm text-slate-500">Beritahu kami alasan pembatalan Anda agar kami dapat meningkatkan layanan kami.</p>
            <textarea 
              className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm" 
              rows={3} 
              placeholder="Alasan pembatalan..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="mt-6 flex gap-2">
              <Button variant="danger" className="flex-1" onClick={() => cancelBooking(cancelReason).then(() => setShowCancelModal(false))}>Ya, Batalkan</Button>
              <Button variant="ghost" className="flex-1" onClick={() => setShowCancelModal(false)}>Tidak</Button>
            </div>
          </Card>
        </div>
      )}
    </PublicLayout>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-bold text-slate-700 text-right">{value}</span>
    </div>
  );
}
