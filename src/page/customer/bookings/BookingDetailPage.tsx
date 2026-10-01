import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useBookingDetail } from '@/features/customer/bookings/hooks/useBookings';
import { useProfile } from '@/features/customer/profile/hooks/useProfile';
import { bookingService } from '@/features/customer/bookings/services/BookingService';
import { historyService } from '@/features/customer/bookings/services/HistoryService';
import { reviewService } from '@/features/customer/reviews/services/ReviewService';
import type { ReviewFormData } from '@/features/customer/reviews/types/Review';
import BookingStatusBadge from '@/features/customer/bookings/components/BookingStatusBadge';
import QuotationSection from '@/features/customer/bookings/components/QuotationSection';
import PaymentSection from '@/features/customer/bookings/components/PaymentSection';
import BookingTimeline from '@/features/customer/bookings/components/BookingTimeline';
import ReviewForm from '@/features/customer/reviews/components/ReviewForm';
import { Button } from '@/components/ui/Button';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Modal } from '@/components/ui/Modal';
import {
  Calendar, MapPin, Users, Bus, Info,
  FileText, XCircle, FileDown, Star,
  CheckCircle2, Clock, Compass, CircleDollarSign,
  ClipboardList, Check, Quote, Paperclip
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatter';
import { useToastStore } from '@/store/useToastStore';
import { buildWhatsAppHref } from '@/features/admin/company-profile/utils/companyProfileUtils';
import Whatsapp from '@thesvg/react/whatsapp';

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-pale-gray pb-3 mb-4">
        <div className="text-action-blue">
          <Icon size={16} />
        </div>
        <h3 className="text-sm font-black text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    booking, paymentMethods, companyProfile,
    loading: detailLoading, error, refresh,
    acceptQuotation, reviseQuotation, cancelBooking, completeBooking
  } = useBookingDetail(id!);

  const { profile, loading: profileLoading } = useProfile();
  const { showSuccess, showError } = useToastStore();

  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState('');
  const [cancelLoading, setCancelLoading] = React.useState(false);

  const [showCompleteModal, setShowCompleteModal] = React.useState(false);
  const [completeLoading, setCompleteLoading] = React.useState(false);

  const handleComplete = async () => {
    setCompleteLoading(true);
    try {
      await completeBooking();
      setShowCompleteModal(false);
    } finally {
      setCompleteLoading(false);
    }
  };

  const [timeline, setTimeline] = React.useState<any[]>([]);
  const [loadingTimeline, setLoadingTimeline] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'info' | 'fleet' | 'quotation' | 'history' | 'document' | 'review'>('info');
  const [isEditingReview, setIsEditingReview] = React.useState(false);

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
      showSuccess('Invoice berhasil diunduh');
    } catch (err: any) {
      console.error('Failed to download invoice:', err);
      showError('Gagal mengunduh invoice');
    }
  };

  const handleWhatsApp = () => {
    if (!companyProfile?.whatsapp?.[0] || !booking) return;
    const msg = `Halo Admin Boneh Star, saya ingin menanyakan mengenai detail pemesanan #${booking.booking_code}.`;
    window.open(buildWhatsAppHref(companyProfile.whatsapp[0], msg), '_blank');
  };

  if (detailLoading || profileLoading) return (
    <CustomerLayout>
      <div className="flex min-h-[40vh] items-center justify-center"><Loader /></div>
    </CustomerLayout>
  );

  if (error || !booking) return (
    <CustomerLayout>
      <div className="flex min-h-[40vh] items-center justify-center">
        <ErrorState message={error || 'Pemesanan tidak ditemukan'} onRetry={refresh} />
      </div>
    </CustomerLayout>
  );

  const hasUploadedPayments = !!(
    booking.transaction?.payments &&
    booking.transaction.payments.some((p: any) => ['pending', 'verified'].includes(p.status))
  );

  const canCancel = ['pending', 'quoted'].includes(booking.status) && !hasUploadedPayments;

  const showCompleteButton = ['confirmed', 'ongoing'].includes(booking.status);
  
  const returnDateReached = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDateStr = (booking.return_date || booking.departure_date).slice(0, 10);
    const [y, m, d] = targetDateStr.split('-').map(Number);
    const returnDate = new Date(y, m - 1, d); // local midnight, no UTC shift
    return today >= returnDate;
  })();

  const isFullyPaid = booking.transaction?.status === 'fully_paid';
  const completeEnabled = returnDateReached && isFullyPaid;

  // Helper date formatting
  const formatDateWithDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return `${formattedDate} (${dayName})`;
  };

  // Helper date/time formatting for submitted date
  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return '';
    // Backend mengembalikan "2026-08-19 02:02:00" (UTC tanpa marker)
    // Tambahkan 'Z' agar browser parse sebagai UTC → otomatis konversi ke WIB (UTC+7)
    const utcStr = dateStr.endsWith('Z') || dateStr.includes('+')
      ? dateStr
      : dateStr.replace(' ', 'T') + 'Z';
    const date = new Date(utcStr);
    const datePart = date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timePart = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${datePart}, ${timePart} WIB`;
  };

  // Helper duration calculation
  const calculateDuration = (depDate: string, retDate: string | null) => {
    if (!retDate) return '1 Hari';
    const dep = new Date(depDate);
    const ret = new Date(retDate);
    const diffTime = Math.abs(ret.getTime() - dep.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} Hari`;
  };



  // Extract selected bus preferences if stored in notes
  const preferredBus = (() => {
    if (!booking.special_notes) return null;
    const match = booking.special_notes.match(/\[Armada Pilihan Customer: (.*?)\]/);
    return match ? match[1] : null;
  })();

  const cleanSpecialNotes = (() => {
    if (!booking.special_notes) return '';
    return booking.special_notes.replace(/\[Armada Pilihan Customer: .*?\]/, '').trim();
  })();

  return (
    <CustomerLayout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2">

        {/* ── Breadcrumb & Title Section ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 border-b border-pale-gray pb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Detail Pemesanan</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-blue mt-1">
              <span className="cursor-pointer hover:text-action-blue transition-colors font-medium" onClick={() => navigate('/customer/bookings')}>Pemesanan</span>
              <span className="text-steel-gray">/</span>
              <span className="font-semibold text-gray-900">Detail Pemesanan</span>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <div className="flex items-center gap-2">
              <BookingStatusBadge status={booking.status} />
            </div>
            <p className="text-[10px] text-slate-blue font-medium mt-0.5">
              Diajukan pada {formatDateTime(booking.created_at)}
            </p>
          </div>
        </div>

        {/* ── Main Layout: 2 Columns Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-6">

            {/* Destination Highlight Header Card */}
            <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row gap-5 items-stretch">


                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">{booking.activity?.name ?? 'Pemesanan Bus'}</h2>
                    
                    {/* Meta info row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2.5 text-xs font-bold text-slate-blue">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-action-blue" />
                        <span>{formatDate(booking.departure_date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-action-blue" />
                        <span>{calculateDuration(booking.departure_date, booking.return_date)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-action-blue" />
                        <span>{booking.passenger_count} Peserta</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bus size={14} className="text-action-blue" />
                        <span>{booking.route_type?.scope === 'outside' ? 'Big Bus' : 'Medium Bus'}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-blue mt-3 leading-relaxed">
                      Perjalanan kegiatan {booking.activity?.name.toLowerCase() ?? 'wisata'} bersama rombongan dengan rute dari {booking.origin} menuju destinasi {booking.full_route ?? 'tujuan'} dan sekitarnya.
                    </p>
                  </div>
                </div>

                {/* Vertical Divider & Code Info (Desktop only) */}
                <div className="hidden md:flex flex-col justify-between pl-5 border-l border-pale-gray w-[160px] shrink-0 text-right">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-steel-gray">Kode Pemesanan</p>
                    <p className="text-xs font-black text-gray-900 mt-0.5">{booking.booking_code}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-steel-gray">Status</p>
                    <p className="text-xs font-black text-action-blue mt-0.5">
                      {booking.status === 'pending' ? 'Menunggu Penawaran' : 
                       booking.status === 'quoted' ? 'Negosiasi Harga' :
                       booking.status === 'confirmed' ? 'Dikonfirmasi' :
                       booking.status === 'ongoing' ? 'Berjalan' :
                       booking.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-pale-gray">
              <nav className="flex flex-wrap gap-x-6 gap-y-2">
                <TabButton
                  active={activeTab === 'info'}
                  onClick={() => setActiveTab('info')}
                  icon={ClipboardList}
                  label="Informasi Perjalanan"
                />
                <TabButton
                  active={activeTab === 'fleet'}
                  onClick={() => setActiveTab('fleet')}
                  icon={Bus}
                  label="Armada & Fasilitas"
                />
                <TabButton
                  active={activeTab === 'quotation'}
                  onClick={() => setActiveTab('quotation')}
                  icon={CircleDollarSign}
                  label="Penawaran"
                  badge={booking.status === 'quoted' ? 1 : undefined}
                />
                <TabButton
                  active={activeTab === 'history'}
                  onClick={() => setActiveTab('history')}
                  icon={Clock}
                  label="Riwayat"
                />
                <TabButton
                  active={activeTab === 'document'}
                  onClick={() => setActiveTab('document')}
                  icon={FileText}
                  label="Dokumen"
                />
                {booking.status === 'completed' && (
                  <TabButton
                    active={activeTab === 'review'}
                    onClick={() => setActiveTab('review')}
                    icon={Star}
                    label="Ulasan"
                  />
                )}
              </nav>
            </div>

            {/* Tabs Content */}
            <div className="transition-all duration-300">
              
              {/* TAB 1: Informasi Perjalanan */}
              {activeTab === 'info' && (
                <div className="flex flex-col gap-6">
                  {/* Detailed Info Grid */}
                  <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900 border-b border-pale-gray pb-3 mb-4">Informasi Perjalanan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                      {/* Left Column */}
                      <div className="flex flex-col gap-4">
                        <DetailRow icon={Compass} label="Jenis Kegiatan" value={booking.activity?.name ?? '—'} />
                        <DetailRow icon={MapPin} label="Tujuan / Rute" value={booking.full_route || booking.origin} />
                        <DetailRow 
                          icon={Calendar} 
                          label="Tanggal Berangkat" 
                          value={formatDateWithDay(booking.departure_date)} 
                          badge="Keberangkatan"
                        />
                        <DetailRow icon={Clock} label="Waktu Berangkat" value="07:00 WIB" />
                        <DetailRow icon={MapPin} label="Keberangkatan" value={booking.origin} />
                      </div>

                      {/* Right Column */}
                      <div className="flex flex-col gap-4">
                        <DetailRow 
                          icon={Calendar} 
                          label="Tanggal Kembali" 
                          value={booking.return_date ? formatDateWithDay(booking.return_date) : 'Satu Hari Perjalanan'} 
                          badge={booking.return_date ? "Kembali" : undefined}
                        />
                        <DetailRow icon={Clock} label="Waktu Kembali" value="17:00 WIB" />
                        <DetailRow icon={Users} label="Jumlah Peserta" value={`${booking.passenger_count} Orang`} />
                        <DetailRow 
                          icon={Users} 
                          label="Contact Person" 
                          value={profile ? `${profile.name} - ${profile.phone}` : '—'} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Catatan */}
                  <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900 border-b border-pale-gray pb-3 mb-4">Catatan</h3>
                    {cleanSpecialNotes ? (
                      <div className="flex gap-3.5 p-4 rounded-xl bg-cloud-mist border border-pale-gray italic text-slate-blue text-xs font-semibold leading-relaxed">
                        <Quote size={20} className="text-action-blue shrink-0 rotate-180 opacity-60" />
                        <p>"{cleanSpecialNotes}"</p>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-blue italic font-semibold">Tidak ada catatan tambahan.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: Armada & Fasilitas */}
              {activeTab === 'fleet' && (
                <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-black text-gray-900 border-b border-pale-gray pb-3 mb-4">Armada &amp; Fasilitas</h3>
                  
                  {booking.booking_buses && booking.booking_buses.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {booking.booking_buses.map((bb, idx) => (
                        <div key={bb.id || idx} className="p-4 rounded-xl border border-pale-gray bg-cloud-mist flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-white border border-pale-gray flex items-center justify-center text-action-blue shrink-0 shadow-sm">
                              <Bus size={20} strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-gray-900">{bb.bus?.name || 'Armada Boneh Star'}</p>
                              <p className="text-[10px] font-bold text-slate-blue mt-0.5">{bb.bus?.plat_number || 'No Plat'}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {bb.bus?.facilities?.map(f => (
                                  <span key={f.id} className="text-[9px] font-bold text-action-blue bg-action-blue/5 px-2 py-0.5 rounded-full border border-action-blue/10">
                                    {f.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="sm:text-right border-t sm:border-t-0 border-pale-gray pt-3 sm:pt-0">
                            <p className="text-[9px] font-black uppercase tracking-wider text-steel-gray">Driver Ditugaskan</p>
                            <p className="text-xs font-bold text-gray-900 mt-0.5">{bb.driver?.name || 'Nama Driver'}</p>
                            <p className="text-[10px] text-slate-blue font-semibold mt-0.5">{bb.driver?.phone || 'No Telp'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 px-4 text-center">
                      <div className="h-12 w-12 rounded-full bg-cloud-mist border border-pale-gray flex items-center justify-center text-steel-gray mx-auto mb-3">
                        <Bus size={22} strokeWidth={1.5} />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Armada &amp; Driver Belum Ditugaskan</p>
                      <p className="text-xs text-slate-blue mt-1 max-w-sm mx-auto leading-relaxed">
                        Armada bus dan driver resmi akan dialokasikan oleh admin setelah harga penawaran disetujui dan pembayaran DP dikonfirmasi.
                      </p>
                      {preferredBus && (
                        <div className="mt-4 p-3.5 rounded-xl border border-amber-100 bg-amber-50/40 text-xs font-semibold text-amber-800 max-w-md mx-auto">
                          Preferensi Pilihan Anda: <span className="font-black">{preferredBus}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: Penawaran */}
              {activeTab === 'quotation' && (
                <div className="flex flex-col gap-6">
                  {booking.quotation ? (
                    <Section title="Penawaran Harga" icon={FileText}>
                      <QuotationSection
                        quotation={booking.quotation as any}
                        whatsappNumber={companyProfile?.whatsapp?.[0]}
                        bookingCode={booking.booking_code}
                        bookingStatus={booking.status}
                        onAccept={() => acceptQuotation(booking.quotation!.id)}
                        onRevise={(note) => reviseQuotation(booking.quotation!.id, note)}
                      />
                    </Section>
                  ) : (
                    <div className="rounded-2xl bg-cloud-mist border border-pale-gray p-8 text-center">
                      <Clock size={28} className="text-steel-gray mx-auto mb-3" strokeWidth={1.5} />
                      <p className="text-sm font-bold text-gray-900">Menunggu Penawaran</p>
                      <p className="text-xs text-slate-blue mt-1 leading-relaxed max-w-sm mx-auto">
                        Admin sedang menyiapkan penawaran harga untuk perjalanan Anda. Anda akan mendapat notifikasi setelah penawaran tersedia.
                      </p>
                    </div>
                  )}

                  {booking.transaction && (
                    <Section title="Manajemen Pembayaran" icon={FileDown}>
                      <PaymentSection
                        transaction={booking.transaction as any}
                        paymentMethods={paymentMethods}
                        departureDate={booking.departure_date}
                        requiredDp={booking.quotation?.dp_amount}
                        onUpload={(data) => 
                          bookingService.uploadPayment(booking.id, data)
                            .then(() => {
                              showSuccess('Bukti pembayaran berhasil diunggah');
                              refresh();
                            })
                            .catch((err: any) => {
                              throw err; // rethrow agar PaymentSection bisa handle & tampilkan error di form
                            })
                        }
                      />
                    </Section>
                  )}


                </div>
              )}

              {/* TAB 4: Riwayat */}
              {activeTab === 'history' && (
                <div className="rounded-2xl bg-white border border-pale-gray shadow-sm p-5">
                  <h3 className="text-sm font-black text-gray-900 border-b border-pale-gray pb-3 mb-5">Riwayat Status</h3>
                  {loadingTimeline ? (
                    <div className="flex justify-center py-8"><Loader /></div>
                  ) : timeline.length === 0 ? (
                    <div className="py-8 text-center">
                      <Clock size={28} className="text-steel-gray mx-auto mb-2" strokeWidth={1.5} />
                      <p className="text-sm text-slate-blue font-medium">Belum ada riwayat status</p>
                    </div>
                  ) : (
                    <BookingTimeline timeline={timeline} />
                  )}
                </div>
              )}

              {/* TAB 5: Dokumen */}
              {activeTab === 'document' && (
                <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-black text-gray-900 border-b border-pale-gray pb-3 mb-4">Dokumen Pemesanan</h3>
                  
                  {booking.transaction ? (
                    <div className="flex flex-col gap-3">
                      <div className="p-4 rounded-xl border border-pale-gray bg-cloud-mist flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-white border border-pale-gray flex items-center justify-center text-red-500 shrink-0 shadow-sm">
                            <FileText size={20} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className="text-xs font-black text-gray-900">Invoice Tagihan Sewa</p>
                            <p className="text-[10px] font-bold text-slate-blue mt-0.5">{booking.transaction.invoice_number}</p>
                          </div>
                        </div>
                        <button
                          onClick={handleDownloadInvoice}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-pale-gray bg-white text-xs font-bold text-action-blue hover:bg-cloud-mist transition-colors cursor-pointer shadow-sm"
                        >
                          <FileDown size={13} />
                          Unduh
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 px-4 text-center">
                      <div className="h-12 w-12 rounded-full bg-cloud-mist border border-pale-gray flex items-center justify-center text-steel-gray mx-auto mb-3">
                        <Paperclip size={22} strokeWidth={1.5} />
                      </div>
                      <p className="text-sm font-bold text-gray-900">Belum Ada Dokumen</p>
                      <p className="text-xs text-slate-blue mt-1 leading-relaxed">
                        Dokumen invoice resmi akan diterbitkan otomatis setelah penawaran harga disetujui.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: Ulasan */}
              {activeTab === 'review' && booking.status === 'completed' && (
                <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm">
                  <h3 className="text-sm font-black text-gray-900 border-b border-pale-gray pb-3 mb-4">Ulasan Perjalanan</h3>
                  {(booking as any).review && !isEditingReview ? (
                    <div className="flex flex-col gap-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shrink-0">
                          <CheckCircle2 size={22} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Ulasan Anda sudah dikirim</p>
                          <p className="text-xs text-slate-blue mt-0.5">Terima kasih atas ulasan dan masukan Anda!</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-pale-gray bg-cloud-mist flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < (booking as any).review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} 
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Penilaian: {(booking as any).review.rating} / 5
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">
                          "{(booking as any).review.comment}"
                        </p>
                      </div>

                      <button
                        onClick={() => setIsEditingReview(true)}
                        className="mt-2 w-full sm:w-auto px-6 py-2.5 rounded-xl border border-pale-gray bg-white text-xs font-bold text-action-blue hover:bg-cloud-mist transition-colors cursor-pointer shadow-sm text-center"
                      >
                        Edit Ulasan
                      </button>
                    </div>
                  ) : (
                    <ReviewForm
                      bookingId={booking.id}
                      initialRating={(booking as any).review?.rating}
                      initialComment={(booking as any).review?.comment}
                      onCancel={(booking as any).review ? () => setIsEditingReview(false) : undefined}
                      onSubmit={async (data: ReviewFormData) => {
                        try {
                          if ((booking as any).review) {
                            await reviewService.update((booking as any).review.id, {
                              rating: data.rating,
                              comment: data.comment
                            });
                            showSuccess('Ulasan Anda berhasil diubah');
                          } else {
                            await reviewService.create(data);
                            showSuccess('Ulasan Anda berhasil dikirim');
                          }
                          setIsEditingReview(false);
                          refresh();
                        } catch (err: any) {
                          showError(err.response?.data?.message || err.message || 'Gagal mengirim ulasan');
                        }
                      }}
                    />
                  )}
                </div>
              )}

            </div>

          </div>

          {/* ── RIGHT COLUMN: SIDEBAR ── */}
          <div className="flex flex-col gap-5 w-full shrink-0 lg:sticky lg:top-24">

            {/* Ringkasan Pemesanan */}
            <div className="bg-white rounded-2xl border border-pale-gray shadow-sm overflow-hidden w-full">
              <div className="px-4 py-3 border-b border-pale-gray">
                <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase">Ringkasan Pemesanan</h3>
              </div>

              <div className="px-4 py-4 flex flex-col gap-3">
                <SidebarItem label="Estimasi Durasi" value={calculateDuration(booking.departure_date, booking.return_date)} />
                <SidebarItem label="Jumlah Peserta" value={`${booking.passenger_count} Orang`} />
                <SidebarItem label="Jenis Armada" value={booking.route_type?.scope === 'outside' ? 'Big Bus' : 'Medium Bus'} />
                
                {/* Estimasi Harga */}
                <div className="mt-2 pt-3 border-t border-pale-gray flex justify-between items-center">
                  <span className="text-[11px] font-bold text-slate-blue">Estimasi Harga</span>
                  <span className="text-sm font-black text-action-blue">
                    {booking.quotation?.proposed_price ? formatCurrency(booking.quotation.proposed_price) : 'Menunggu Penawaran'}
                  </span>
                </div>

                {/* Alert box */}
                <div className="mt-2.5 p-3 rounded-xl bg-action-blue/[0.04] border border-action-blue/10 flex gap-2 items-start text-[10px] text-action-blue leading-normal font-semibold">
                  <Info size={13} className="shrink-0 mt-0.5 text-action-blue" />
                  <p>Harga dapat berubah sesuai penawaran resmi dari admin.</p>
                </div>
              </div>
            </div>

            {/* Status Pemesanan (Vertical Timeline) */}
            <div className="bg-white rounded-2xl border border-pale-gray shadow-sm p-4 w-full">
              <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase border-b border-pale-gray pb-2.5 mb-4">Status Pemesanan</h3>
              
              <div className="flex flex-col gap-5 relative pl-4">
                {/* Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-pale-gray" />

                {/* Step 1 */}
                <TimelineStep 
                  active={true}
                  completed={true}
                  title="Pengajuan"
                  desc={formatDateTime(booking.created_at)}
                />

                {/* Step 2 */}
                <TimelineStep 
                  active={booking.status !== 'pending'}
                  completed={['quoted', 'confirmed', 'ongoing', 'completed'].includes(booking.status)}
                  title="Menunggu Penawaran"
                  desc={booking.status === 'pending' ? 'Menunggu respon admin' : 'Penawaran disiapkan'}
                />

                {/* Step 3 */}
                <TimelineStep 
                  active={['quoted', 'confirmed', 'ongoing', 'completed'].includes(booking.status)}
                  completed={['confirmed', 'ongoing', 'completed'].includes(booking.status)}
                  title="Negosiasi"
                  desc={booking.status === 'quoted' ? 'Menunggu persetujuan penawaran' : 'Penawaran disetujui'}
                />

                {/* Step 4 */}
                <TimelineStep 
                  active={booking.status === 'completed'}
                  completed={booking.status === 'completed'}
                  title="Selesai"
                  desc="Pemesanan selesai"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {showCompleteButton && (
                <div className="flex flex-col gap-2">
                  <button
                    disabled={!completeEnabled}
                    onClick={() => setShowCompleteModal(true)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      completeEnabled 
                        ? 'border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100' 
                        : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    Selesaikan Perjalanan
                  </button>

                  {!completeEnabled && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-amber-800 leading-relaxed font-semibold">
                      <p className="font-bold mb-1">Penyelesaian Perjalanan:</p>
                      <ul className="list-disc pl-3 flex flex-col gap-0.5">
                        <li className={returnDateReached ? "text-emerald-700 font-bold" : "text-amber-850"} style={{ color: returnDateReached ? '#047857' : '#92400e' }}>
                          Tanggal pulang ({booking.return_date ? formatDate(booking.return_date) : formatDate(booking.departure_date)}) telah tiba/lewat {returnDateReached && '✓'}
                        </li>
                        <li className={isFullyPaid ? "text-emerald-700 font-bold" : "text-amber-850"} style={{ color: isFullyPaid ? '#047857' : '#92400e' }}>
                          Pembayaran tagihan sudah lunas {isFullyPaid && '✓'}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-100 bg-rose-50 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all cursor-pointer shadow-sm"
                >
                  <XCircle size={14} />
                  Batalkan Pemesanan
                </button>
              )}

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer shadow-sm"
              >
                <Whatsapp width={14} height={14} />
                Hubungi Admin
              </button>
            </div>

          </div>

        </div>

        {/* ── Cancel Modal ── */}
        <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)} title="Batalkan Pemesanan">
          <div className="flex flex-col gap-5">
            <p className="text-sm text-slate-blue leading-relaxed">
              Apakah Anda yakin ingin membatalkan pemesanan ini? Berikan alasan singkat.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-steel-gray">
                Alasan Pembatalan *
              </label>
              <textarea
                className="w-full rounded-xl border border-pale-gray bg-cloud-mist p-3 text-sm font-medium text-gray-800 focus:border-action-blue focus:bg-white focus:ring-2 focus:ring-action-blue/10 outline-none transition-all resize-none"
                rows={4}
                placeholder="Contoh: Perubahan jadwal, anggaran berubah, dll."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" loading={cancelLoading} onClick={handleCancel}>
                Ya, Batalkan
              </Button>
              <Button
                variant="ghost"
                className="flex-1 text-slate-blue hover:text-gray-900"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                Kembali
              </Button>
            </div>
          </div>
        </Modal>

        {/* ── Complete Trip Modal ── */}
        <Modal 
          open={showCompleteModal} 
          onClose={() => setShowCompleteModal(false)} 
          size="md"
        >
          <div className="flex flex-col gap-6 text-center pt-5 sm:pt-3">
            {/* Centered Title */}
            <div className="border-b border-platinum-tint/40 pb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-midnight-indigo">
                Selesaikan Perjalanan
              </h3>
            </div>

            <div className="flex flex-col items-center text-center gap-4 py-2">
              <div className="h-16 w-16 rounded-full bg-action-blue/10 text-action-blue flex items-center justify-center shadow-inner">
                <CheckCircle2 size={32} className="stroke-[2.5]" />
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-bold text-midnight-indigo px-2 leading-relaxed">
                  Apakah Anda yakin perjalanan ini telah selesai?
                </p>
                <p className="text-xs font-semibold text-slate-blue/80 px-4 leading-relaxed">
                  Setelah diselesaikan, status pemesanan akan diperbarui dan Anda dapat memberikan ulasan serta rating untuk armada bus ini.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 font-bold h-11 rounded-xl cursor-pointer"
                onClick={() => setShowCompleteModal(false)}
                disabled={completeLoading}
              >
                Kembali
              </Button>
              <Button
                variant="primary"
                className="flex-1 font-bold h-11 rounded-xl cursor-pointer shadow-md shadow-blue-500/10"
                loading={completeLoading}
                onClick={handleComplete}
              >
                Ya, Selesai
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </CustomerLayout>
  );
}

// ── Helper Components ─────────────────────────────────────────────────────────

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

function TabButton({ active, onClick, icon: Icon, label, badge }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 py-3 px-1 border-b-2 text-xs font-bold transition-all cursor-pointer relative ${
        active 
          ? 'border-action-blue text-action-blue' 
          : 'border-transparent text-slate-blue hover:text-gray-900 hover:border-steel-gray'
      }`}
    >
      <Icon size={14} />
      <span>{label}</span>
      {badge !== undefined && (
        <span className="absolute top-1 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[8px] font-bold text-white shadow-sm animate-pulse">
          {badge}
        </span>
      )}
    </button>
  );
}

function DetailRow({ icon: Icon, label, value, badge }: { icon: any; label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-start gap-3 text-xs leading-normal">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cloud-mist border border-pale-gray text-action-blue shrink-0">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-steel-gray uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="font-black text-gray-900">{value}</p>
          {badge && (
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-xs font-bold">
      <span className="text-slate-blue">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

interface TimelineStepProps {
  active: boolean;
  completed: boolean;
  title: string;
  desc: string;
}

function TimelineStep({ active, completed, title, desc }: TimelineStepProps) {
  return (
    <div className="flex gap-3 relative z-10">
      <div className="flex-shrink-0 mt-0.5">
        <div className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          completed 
            ? 'bg-emerald-500 border-emerald-500 text-white' 
            : active 
              ? 'bg-white border-action-blue text-action-blue ring-2 ring-action-blue/15' 
              : 'bg-white border-pale-gray text-steel-gray'
        }`}>
          {completed ? (
            <Check size={9} strokeWidth={4} />
          ) : (
            <div className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-action-blue' : 'bg-steel-gray'}`} />
          )}
        </div>
      </div>
      <div>
        <p className={`text-xs font-black leading-none ${active ? 'text-gray-900' : 'text-slate-blue'}`}>{title}</p>
        <p className="text-[9px] font-bold text-steel-gray mt-1 leading-normal">{desc}</p>
      </div>
    </div>
  );
}



