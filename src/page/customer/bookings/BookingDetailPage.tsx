import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useBookingDetail } from '@/features/customer/bookings/hooks/useBookings';
import { bookingService } from '@/features/customer/bookings/services/BookingService';
import { historyService } from '@/features/customer/bookings/services/HistoryService';
import { reviewService } from '@/features/customer/reviews/services/ReviewService';
import type { ReviewFormData } from '@/features/customer/reviews/types/Review';
import BookingStatusBadge from '@/features/customer/bookings/components/BookingStatusBadge';
import QuotationSection from '@/features/customer/bookings/components/QuotationSection';
import PaymentSection from '@/features/customer/bookings/components/PaymentSection';
import BookingTimeline from '@/features/customer/bookings/components/BookingTimeline';
import ReviewForm from '@/features/customer/reviews/components/ReviewForm';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Modal } from '@/components/ui/Modal';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Bus, 
  ArrowLeft, 
  Info, 
  FileText, 
  XCircle,
  FileDown,
  Star
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatter';

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    booking, 
    paymentMethods,
    companyProfile,
    loading, 
    error, 
    refresh, 
    acceptQuotation, 
    reviseQuotation,
    cancelBooking 
  } = useBookingDetail(id!);

  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [cancelLoading, setCancelLoading] = React.useState(false);
  const [timeline, setTimeline] = React.useState<any[]>([]);
  const [loadingTimeline, setLoadingTimeline] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      setLoadingTimeline(true);
      historyService.getDetail(id).then(res => {
        setTimeline(res.timeline);
      }).finally(() => setLoadingTimeline(false));
    }
  }, [id, booking?.status]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setCancelLoading(true);
    try {
      await cancelBooking(cancelReason);
      setShowCancelModal(false);
    } finally {
      setCancelLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!id || !booking?.transaction) return;
    try {
      const blob = await historyService.downloadInvoice(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${booking.transaction.invoice_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download invoice:', err);
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader />
        </div>
      </CustomerLayout>
    );
  }

  if (error || !booking) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <ErrorState message={error || 'Pemesanan tidak ditemukan'} onRetry={refresh} />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      {/* Header Actions */}
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <button 
          onClick={() => navigate('/customer/bookings')} 
          className="group flex items-center gap-2 text-sm font-bold text-slate-blue hover:text-midnight-indigo transition-colors"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
          Kembali ke Riwayat
        </button>
        <div className="flex items-center gap-3">
          {booking.transaction && (
            <Button 
              variant="outline" 
              size="sm" 
              icon={FileDown} 
              onClick={handleDownloadInvoice}
              className="rounded-xl font-bold border-platinum-tint/80 hover:bg-cloud-mist hover:text-midnight-indigo text-slate-blue"
            >
              Download Invoice
            </Button>
          )}
          {['pending', 'quoted'].includes(booking.status) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-rose-600 hover:bg-rose-50 font-bold" 
              onClick={() => setShowCancelModal(true)}
              icon={XCircle}
            >
              Batalkan Pesanan
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Left Column: Details & Payments */}
        <div className="flex flex-col gap-10">
          {/* Main Info Card */}
          <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black tracking-tighter text-midnight-indigo">#{booking.booking_code}</h1>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="text-sm font-semibold text-slate-blue/70">
                Pemesanan dibuat pada {formatDate(booking.created_at)}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <DetailItem icon={Calendar} label="Jadwal" value={booking.return_date ? `${formatDate(booking.departure_date)} - ${formatDate(booking.return_date)}` : formatDate(booking.departure_date)} />
              <DetailItem icon={MapPin} label="Rute Perjalanan" value={`${booking.origin} (${booking.full_route || 'Rute belum diatur'})`} />
              <DetailItem icon={Users} label="Kapasitas" value={`${booking.passenger_count} Penumpang`} />
              <DetailItem icon={Bus} label="Armada" value={`${booking.bus_count_requested} Unit Bus`} />
            </div>

            <div className="rounded-[16px] bg-cloud-mist p-6 border border-platinum-tint/50">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-slate-blue">
                  <Info size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-blue/60 mb-1">Catatan Tambahan</p>
                  <p className="text-sm font-bold text-midnight-indigo leading-relaxed italic">
                    {booking.special_notes || 'Tidak ada catatan khusus untuk perjalanan ini.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-platinum-tint/50" />

          {/* Quotation Section */}
          {booking.quotation && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Penawaran Harga</h2>
              <QuotationSection 
                quotation={booking.quotation as any} 
                whatsappNumber={companyProfile?.whatsapp?.[0]}
                bookingCode={booking.booking_code}
                onAccept={() => acceptQuotation(booking.quotation!.id)} 
                onRevise={(note) => reviseQuotation(booking.quotation!.id, note)}
              />
            </div>
          )}

          {/* Payment Section */}
          {booking.transaction && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Manajemen Pembayaran</h2>
              <PaymentSection 
                transaction={booking.transaction as any} 
                paymentMethods={paymentMethods}
                departureDate={booking.departure_date}
                onUpload={(data) => bookingService.uploadPayment(booking.id, data).then(refresh)}
              />
            </div>
          )}

          {/* Review Section */}
          {booking.status === 'completed' && (
            <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Bagikan Pengalaman</h2>
              <Card className="border border-platinum-tint shadow-sm hover:shadow-card transition-shadow p-8 sm:p-10 rounded-[16px]">
                {(booking as any).review ? (
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Star className="fill-emerald-600" size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-midnight-indigo">Terima kasih atas ulasan Anda!</h3>
                      <p className="mt-2 text-sm font-medium text-slate-blue max-w-sm">
                        Ulasan Anda telah kami terima dan sangat berarti bagi kami untuk terus meningkatkan kualitas layanan.
                      </p>
                    </div>
                  </div>
                ) : (
                  <ReviewForm 
                    bookingId={booking.id} 
                    onCancel={() => {}} 
                    onSubmit={async (data: ReviewFormData) => {
                      await reviewService.create(data);
                      refresh();
                    }}
                  />
                )}
              </Card>
            </div>
          )}
        </div>

        {/* Right Column: Summary */}
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500 delay-150">
          <Card className="flex flex-col gap-8 border border-platinum-tint shadow-sm p-6 rounded-[16px] sticky top-32 bg-white">
            <div className="flex items-center gap-4 border-b border-platinum-tint/40 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cloud-mist text-slate-blue">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-blue/60 mb-0.5">Kategori Kegiatan</p>
                <h3 className="text-sm font-black text-midnight-indigo">{booking.activity?.name}</h3>
              </div>
            </div>
            
            <div className="flex flex-col gap-5">
              <SummaryRow label="Tipe Rute" value={booking.route_type?.name || '-'} />
              <SummaryRow label="Status" value={<BookingStatusBadge status={booking.status} />} />
              
              {booking.transaction && (
                <>
                  <div className="my-2 h-px bg-platinum-tint/30" />
                  <SummaryRow 
                    label="Total Biaya" 
                    value={<span className="text-base font-black text-midnight-indigo">{formatCurrency(booking.transaction.total_amount)}</span>} 
                  />
                  <SummaryRow 
                    label="Sisa Tagihan" 
                    value={<span className="text-sm font-black text-action-blue">{formatCurrency(booking.transaction.remaining_amount)}</span>} 
                  />
                </>
              )}
            </div>

            {booking.status === 'cancelled' && (
              <div className="rounded-2xl bg-rose-50 p-5 border border-rose-100/50 mt-2">
                <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-2">Alasan Pembatalan</p>
                <p className="text-xs font-bold text-rose-600 leading-relaxed italic">"{booking.cancelled_reason || 'Tidak ada alasan spesifik.'}"</p>
              </div>
            )}

            <div className="h-px bg-platinum-tint/50" />
            
            <div className="flex flex-col gap-5">
              <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Timeline</h2>
              {loadingTimeline ? (
                <div className="flex justify-center py-4"><Loader size="sm" /></div>
              ) : (
                <BookingTimeline timeline={timeline} />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Batalkan Pemesanan"
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm font-semibold text-slate-blue leading-relaxed">
            Apakah Anda yakin ingin membatalkan pemesanan ini? Berikan alasan singkat untuk membantu kami mengevaluasi layanan kami.
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-blue/60 ml-1">Alasan Pembatalan</label>
            <textarea 
              className="w-full rounded-2xl border border-platinum-tint bg-cloud-mist/50 p-4 text-sm font-semibold focus:border-action-blue focus:ring-1 focus:ring-action-blue outline-none transition-all text-midnight-indigo placeholder:text-slate-blue/40" 
              rows={4} 
              placeholder="Contoh: Perubahan jadwal rencana kegiatan atau masalah lainnya..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button 
              variant="danger" 
              className="flex-1" 
              loading={cancelLoading}
              onClick={handleCancel}
            >
              Ya, Batalkan Pesanan
            </Button>
            <Button 
              variant="ghost" 
              className="flex-1 font-bold" 
              onClick={() => setShowCancelModal(false)}
              disabled={cancelLoading}
            >
              Kembali
            </Button>
          </div>
        </div>
      </Modal>
    </CustomerLayout>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cloud-mist text-slate-blue">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-blue/60 mb-0.5">{label}</p>
        <p className="text-xs font-black text-midnight-indigo leading-snug">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] font-black uppercase tracking-widest text-slate-blue/60">{label}</span>
      <div className="font-bold text-midnight-indigo text-right">{value}</div>
    </div>
  );
}
