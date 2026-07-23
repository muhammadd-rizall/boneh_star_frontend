import React, { useState, useEffect, useRef } from 'react';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useProfile } from '@/features/customer/profile/hooks/useProfile';
import { resolveMediaUrl } from '@/features/admin/company-profile/utils/companyProfileUtils';
import { bookingService } from '@/features/customer/bookings/services/BookingService';
import { reviewService } from '@/features/customer/reviews/services/ReviewService';
import { notificationService } from '@/features/customer/notifications/services/NotificationService';
import type { CustomerNotification } from '@/features/customer/notifications/types/Notification';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import {
  User, Mail, Phone, MapPin, Calendar, Camera,
  Lock, CircleDollarSign, CheckCircle2, Star, Eye, EyeOff,
  Save, CheckCircle
} from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/formatter';
import { useToastStore } from '@/store/useToastStore';

interface ActivityItem {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: any;
  color: string;
}

export default function ProfilePage() {
  const {
    profile, statistics, loading, error,
    updateProfile, updatePassword, uploadPicture, refresh
  } = useProfile();
  
  const { showSuccess, showError } = useToastStore();

  // Dynamic Stats & Activities Data
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  // Edit Akun States
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Password visibility toggles
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch real statistics & activity data
  useEffect(() => {
    async function loadStatsData() {
      try {
        setStatsLoading(true);
        const [bookingsRes, reviewsRes, notificationsRes] = await Promise.all([
          bookingService.getAll({ per_page: 100 }),
          reviewService.getAll({ per_page: 100 }),
          notificationService.getAll({ per_page: 100 }).catch(() => ({ data: { data: [] } }))
        ]);
        setBookings(bookingsRes.data.data || []);
        setReviews(reviewsRes.data.data || []);
        
        // Handle nested notifications response safely
        const notificationsData = notificationsRes.data?.data || [];
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      } catch (err) {
        console.error('Error loading stats data:', err);
      } finally {
        setStatsLoading(false);
      }
    }
    loadStatsData();
  }, []);

  // Sync profile details to inputs
  useEffect(() => {
    if (profile) {
      setEditName(profile.name);
      setEditEmail(profile.email);
      setEditPhone(profile.phone || '');
      setEditAddress(profile.address || '');
    }
  }, [profile]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditSuccess(false);
    setEditError(null);
    try {
      await updateProfile({
        name: editName,
        email: editEmail,
        phone: editPhone,
        address: editAddress
      });
      setEditSuccess(true);
      showSuccess('Profil berhasil diperbarui');
      setTimeout(() => setEditSuccess(false), 4000);
    } catch (err: any) {
      const errMsg = err.message || 'Gagal memperbarui profil';
      setEditError(errMsg);
      showError(errMsg);
    } finally {
      setEditLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password baru tidak cocok');
      showError('Konfirmasi password baru tidak cocok');
      return;
    }
    setPasswordLoading(true);
    setPasswordSuccess(false);
    setPasswordError(null);
    try {
      await updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      setPasswordSuccess(true);
      showSuccess('Password berhasil diubah');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Gagal mengubah password';
      setPasswordError(errMsg);
      showError(errMsg);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await uploadPicture(file);
        showSuccess('Foto profil berhasil diperbarui');
      } catch (err: any) {
        console.error(err);
        showError(err.message || 'Gagal memperbarui foto profil');
      }
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

  if (error || !profile) {
    return (
      <CustomerLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <ErrorState message={error || 'Profil tidak ditemukan'} onRetry={refresh} />
        </div>
      </CustomerLayout>
    );
  }

  // Calculate dynamic stats
  const totalBookings = statistics?.total_bookings ?? bookings.length;
  const completedBookings = statistics?.completed ?? bookings.filter(b => b.status === 'completed').length;
  
  const totalSpent = bookings.reduce((sum, b) => {
    if (b.status !== 'cancelled' && b.transaction?.total_amount) {
      return sum + Number(b.transaction.total_amount);
    }
    return sum;
  }, 0);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  // Helper to resolve icon from notification details
  function getNotificationIcon(title: string) {
    const t = (title || '').toLowerCase();
    if (t.includes('bayar') || t.includes('pembayaran') || t.includes('invoice') || t.includes('bukti')) {
      return { icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' };
    }
    if (t.includes('penawaran') || t.includes('quotation') || t.includes('harga')) {
      return { icon: CircleDollarSign, color: 'bg-amber-50 text-amber-600' };
    }
    if (t.includes('selesai') || t.includes('complete')) {
      return { icon: CheckCircle2, color: 'bg-blue-50 text-action-blue' };
    }
    if (t.includes('ulasan') || t.includes('review') || t.includes('rating')) {
      return { icon: Star, color: 'bg-purple-50 text-purple-600' };
    }
    return { icon: Calendar, color: 'bg-blue-50 text-action-blue' };
  }

  // Build activity feed
  const activities: ActivityItem[] = [];

  if (notifications.length > 0) {
    notifications.forEach((n) => {
      const { icon, color } = getNotificationIcon(n.title);
      activities.push({
        id: n.id,
        title: n.title,
        message: n.message,
        time: n.created_at,
        icon,
        color
      });
    });
  } else {
    // Generate activities from actual records if notifications are empty
    bookings.forEach((booking) => {
      activities.push({
        id: `booking-created-${booking.id}`,
        title: 'Pemesanan dibuat',
        message: `Pemesanan bus tujuan ${booking.origin} (${booking.booking_code}) telah dibuat.`,
        time: booking.created_at,
        icon: Calendar,
        color: 'bg-blue-50 text-action-blue'
      });

      if (booking.quotation && (booking.status === 'confirmed' || booking.status === 'completed')) {
        activities.push({
          id: `quotation-accepted-${booking.id}`,
          title: 'Penawaran disetujui',
          message: `Penawaran harga untuk ${booking.booking_code} telah disetujui.`,
          time: booking.quotation.updated_at || booking.updated_at || booking.created_at,
          icon: CircleDollarSign,
          color: 'bg-emerald-50 text-emerald-600'
        });
      }

      if (booking.transaction?.payments) {
        booking.transaction.payments.forEach((payment: any) => {
          if (payment.status === 'verified' || payment.status === 'approved') {
            activities.push({
              id: `payment-${payment.id}`,
              title: 'Pembayaran terverifikasi',
              message: `Pembayaran ${payment.payment_type === 'dp' ? 'DP' : 'Pelunasan'} sebesar ${formatCurrency(payment.amount)} telah terverifikasi.`,
              time: payment.created_at,
              icon: CheckCircle2,
              color: 'bg-emerald-50 text-emerald-600'
            });
          }
        });
      }

      if (booking.status === 'completed') {
        activities.push({
          id: `booking-completed-${booking.id}`,
          title: 'Pemesanan selesai',
          message: `Perjalanan dengan kode booking ${booking.booking_code} telah selesai dilaksanakan.`,
          time: booking.updated_at || booking.created_at,
          icon: CheckCircle2,
          color: 'bg-blue-50 text-action-blue'
        });
      }
    });

    reviews.forEach((review) => {
      activities.push({
        id: `review-${review.id}`,
        title: 'Ulasan baru diberikan',
        message: `Anda memberikan ulasan bintang ${review.rating} untuk perjalanan Anda.`,
        time: review.created_at,
        icon: Star,
        color: 'bg-purple-50 text-purple-600'
      });
    });
  }

  // Sort and select top 5
  const sortedActivities = activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

  function formatRelativeTime(dateString: string) {
    try {
      const now = new Date();
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} mnt lalu`;
      if (diffHours < 24) return `${diffHours} jam lalu`;
      if (diffDays === 1) return 'Kemarin';
      if (diffDays < 7) return `${diffDays} hari lalu`;
      return formatDate(dateString);
    } catch (e) {
      return '';
    }
  }

  return (
    <CustomerLayout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        
        {/* ── Breadcrumbs and Title ── */}
        <div className="mb-6 border-b border-pale-gray pb-4">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Profil Akun</h1>
        </div>

        {/* ── Top Summary Row: 4 Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Card 1: Total Pemesanan */}
          <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Calendar size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none">
                {statsLoading ? '...' : totalBookings}
              </p>
              <p className="text-xs font-bold text-gray-900 mt-1.5">Total Pemesanan</p>
              <p className="text-[10px] text-slate-blue mt-0.5 font-medium">Semua waktu</p>
            </div>
          </div>

          {/* Card 2: Total Pengeluaran */}
          <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <CircleDollarSign size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xl font-black text-emerald-700 leading-none">
                {statsLoading ? '...' : formatCurrency(totalSpent)}
              </p>
              <p className="text-xs font-bold text-gray-900 mt-1.5">Total Pengeluaran</p>
              <p className="text-[10px] text-slate-blue mt-0.5 font-medium">Semua waktu</p>
            </div>
          </div>

          {/* Card 3: Pemesanan Selesai */}
          <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-action-blue shrink-0">
              <CheckCircle2 size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none">
                {statsLoading ? '...' : completedBookings}
              </p>
              <p className="text-xs font-bold text-gray-900 mt-1.5">Pemesanan Selesai</p>
              <p className="text-[10px] text-slate-blue mt-0.5 font-medium">Semua waktu</p>
            </div>
          </div>

          {/* Card 4: Rating Ulasan */}
          <div className="bg-white border border-pale-gray rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <Star size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 leading-none">
                {statsLoading ? '...' : avgRating}
              </p>
              <p className="text-xs font-bold text-gray-900 mt-1.5">Rating Ulasan</p>
              <p className="text-[10px] text-slate-blue mt-0.5 font-medium">
                Dari {totalReviews} ulasan
              </p>
            </div>
          </div>
        </div>

        {/* ── Main Layout: 2 Columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
          
          {/* ── LEFT COLUMN: FOTO PROFIL, INFORMASI AKUN, & AKTIVITAS TERBARU ── */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Foto Profil Card */}
            <div className="bg-white border border-pale-gray rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
              <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase self-start border-b border-pale-gray pb-2 mb-5 w-full text-left">Foto Profil</h3>
              
              {/* Avatar circle */}
              <div className="relative mb-4">
                <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-cloud-mist bg-cloud-mist shadow-md relative">
                  {profile.profile_picture ? (
                    <img
                      src={resolveMediaUrl(profile.profile_picture)}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-action-blue text-4xl font-black text-white">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Camera badge button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#006bff] hover:bg-[#0052cc] text-white shadow-md border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                  title="Ubah Foto Profil"
                >
                  <Camera size={18} strokeWidth={2.2} />
                </button>
              </div>

              <h2 className="text-base font-black text-gray-900 leading-tight">{profile.name}</h2>
              <p className="text-xs text-slate-blue font-bold mt-1">Pelanggan</p>
              
              <p className="text-[10px] text-steel-gray font-semibold mt-4 mb-4">
                JPG, PNG atau WEBP. Maks. 2MB
              </p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 border border-action-blue/30 hover:border-action-blue rounded-xl text-xs font-bold text-action-blue bg-white hover:bg-action-blue/5 transition-all cursor-pointer shadow-sm"
              >
                Ubah Foto
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* Informasi Akun Card */}
            <div className="bg-white border border-pale-gray rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase border-b border-pale-gray pb-2 mb-4">Informasi Akun</h3>
              
              <div className="flex flex-col gap-4">
                <InfoItem icon={User} label="Nama Lengkap" value={profile.name} />
                
                <div className="flex items-start gap-3 text-xs leading-normal">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cloud-mist border border-pale-gray text-slate-blue shrink-0">
                    <Mail size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-steel-gray uppercase tracking-wider">Email</p>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <p className="font-bold text-gray-900 truncate">{profile.email}</p>
                      <span className="inline-flex items-center gap-0.5 text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                        <CheckCircle size={8} />
                        Verifikasi
                      </span>
                    </div>
                  </div>
                </div>

                <InfoItem icon={Phone} label="No. Telepon" value={profile.phone || '—'} />
                <InfoItem icon={MapPin} label="Alamat" value={profile.address || '—'} />
                <InfoItem icon={Calendar} label="Bergabung Sejak" value={formatDate(profile.created_at)} />
              </div>
            </div>

            {/* Aktivitas Terbaru Card */}
            <div className="bg-white border border-pale-gray rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center border-b border-pale-gray pb-2.5 mb-4">
                <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase">Aktivitas Terbaru</h3>
                <button className="text-[10px] font-black text-action-blue hover:underline">Lihat Semua</button>
              </div>

              <div className="flex flex-col gap-4">
                {statsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader />
                  </div>
                ) : sortedActivities.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-steel-gray font-semibold">Belum ada aktivitas terbaru.</p>
                  </div>
                ) : (
                  sortedActivities.map((act) => (
                    <div key={act.id} className="flex gap-3 items-start">
                      <div className={`h-7 w-7 rounded-lg ${act.color} flex items-center justify-center shrink-0`}>
                        <act.icon size={13} className="stroke-[2.5]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900">{act.title}</p>
                        <p className="text-[10px] text-slate-blue mt-0.5">{act.message}</p>
                      </div>
                      <p className="text-[8px] font-semibold text-steel-gray whitespace-nowrap pt-0.5">
                        {formatRelativeTime(act.time)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: EDIT PROFIL & GANTI PASSWORD ── */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Edit Akun Card */}
            <div className="bg-white border border-pale-gray rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase border-b border-pale-gray pb-2.5 mb-5">Edit Akun</h3>

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
                {editSuccess && (
                  <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 text-xs font-bold text-emerald-600 animate-in fade-in duration-300">
                    Profil berhasil diperbarui.
                  </div>
                )}
                {editError && (
                  <div className="rounded-xl bg-rose-50 p-4 border border-rose-100 text-xs font-bold text-rose-600 animate-in fade-in duration-300">
                    {editError}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  {/* Nama Lengkap */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">Nama Lengkap</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-blue">
                        <User size={14} />
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-pale-gray bg-white pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 focus:border-action-blue focus:ring-2 focus:ring-action-blue/10 outline-none transition-all"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Nama Lengkap"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-blue">
                        <Mail size={14} />
                      </div>
                      <input
                        type="email"
                        required
                        className="w-full rounded-xl border border-pale-gray bg-white pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 focus:border-action-blue focus:ring-2 focus:ring-action-blue/10 outline-none transition-all"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Alamat Email"
                      />
                    </div>
                  </div>

                  {/* No. Telepon */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">No. Telepon</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-blue">
                        <Phone size={14} />
                      </div>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-pale-gray bg-white pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 focus:border-action-blue focus:ring-2 focus:ring-action-blue/10 outline-none transition-all"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="No. Telepon"
                      />
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">Alamat</label>
                    <div className="relative">
                      <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-slate-blue">
                        <MapPin size={14} />
                      </div>
                      <textarea
                        className="w-full rounded-xl border border-pale-gray bg-white pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 focus:border-action-blue focus:ring-2 focus:ring-action-blue/10 outline-none transition-all resize-none"
                        rows={3}
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        placeholder="Alamat Lengkap"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-pale-gray">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-action-blue hover:bg-action-blue/90 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Save size={13} />
                    {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>

            {/* Ganti Password Card */}
            <div className="bg-white border border-pale-gray rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase border-b border-pale-gray pb-2.5 mb-5">Ganti Password</h3>

              <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
                {passwordSuccess && (
                  <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-100 text-xs font-bold text-emerald-600 animate-in fade-in duration-300">
                    Password berhasil diubah.
                  </div>
                )}
                {passwordError && (
                  <div className="rounded-xl bg-rose-50 p-4 border border-rose-100 text-xs font-bold text-rose-600 animate-in fade-in duration-300">
                    {passwordError}
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  
                  {/* Password Saat Ini */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">Password Saat Ini</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-blue">
                        <Lock size={14} />
                      </div>
                      <input
                        type={showCurrentPass ? "text" : "password"}
                        required
                        className="w-full rounded-xl border border-pale-gray bg-white pl-10 pr-10 py-2.5 text-xs font-semibold text-gray-900 focus:border-action-blue focus:ring-2 focus:ring-action-blue/10 outline-none transition-all"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Masukkan password saat ini"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-steel-gray hover:text-slate-blue cursor-pointer"
                      >
                        {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Password Baru */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">Password Baru</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-blue">
                        <Lock size={14} />
                      </div>
                      <input
                        type={showNewPass ? "text" : "password"}
                        required
                        minLength={8}
                        className="w-full rounded-xl border border-pale-gray bg-white pl-10 pr-10 py-2.5 text-xs font-semibold text-gray-900 focus:border-action-blue focus:ring-2 focus:ring-action-blue/10 outline-none transition-all"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Masukkan password baru"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-steel-gray hover:text-slate-blue cursor-pointer"
                      >
                        {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Konfirmasi Password Baru */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-steel-gray">Konfirmasi Password Baru</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-blue">
                        <Lock size={14} />
                      </div>
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        required
                        minLength={8}
                        className="w-full rounded-xl border border-pale-gray bg-white pl-10 pr-10 py-2.5 text-xs font-semibold text-gray-900 focus:border-action-blue focus:ring-2 focus:ring-action-blue/10 outline-none transition-all"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Konfirmasi password baru"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-steel-gray hover:text-slate-blue cursor-pointer"
                      >
                        {showConfirmPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-pale-gray">
                  <p className="text-[10px] text-slate-blue font-semibold max-w-xs leading-normal">
                    Password minimal 8 karakter dengan kombinasi huruf dan angka.
                  </p>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-action-blue hover:bg-action-blue/90 text-xs font-bold text-white transition-colors cursor-pointer shadow-sm disabled:opacity-50 shrink-0"
                  >
                    <Save size={13} />
                    {passwordLoading ? 'Mengubah...' : 'Ubah Password'}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>
    </CustomerLayout>
  );
}

// ── Helper Component ──────────────────────────────────────────────────────────

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-xs leading-normal">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cloud-mist border border-pale-gray text-slate-blue shrink-0">
        <Icon size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[9px] font-black text-steel-gray uppercase tracking-wider">{label}</p>
        <p className="font-bold text-gray-900 mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}
