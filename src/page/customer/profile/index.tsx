import { useState } from 'react';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useProfile } from '@/features/customer/profile/hooks/useProfile';
import ProfileInfo from '@/features/customer/profile/components/ProfileInfo';
import ProfileEditForm from '@/features/customer/profile/components/ProfileEditForm';
import BookingStats from '@/features/customer/profile/components/BookingStats';
import { Modal } from '@/components/ui/Modal';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';

export default function ProfilePage() {
  const { profile, statistics, loading, error, updateProfile, uploadPicture, refresh } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  return (
    <CustomerLayout>
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
          Profil <span className="text-orange-600">Akun</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Kelola informasi pribadi dan lihat ringkasan aktivitas Anda.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {/* Statistics Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Statistik Aktivitas</h2>
          {statistics && <BookingStats statistics={statistics} />}
        </div>

        {/* Profile Info Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Informasi Pribadi</h2>
          <ProfileInfo
            profile={profile}
            onEdit={() => setIsEditModalOpen(true)}
            onUpload={uploadPicture}
          />
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profil Akun"
      >
        <ProfileEditForm
          profile={profile}
          onCancel={() => setIsEditModalOpen(false)}
          onSubmit={async (data) => {
            await updateProfile(data);
            setIsEditModalOpen(false);
          }}
        />
      </Modal>
    </CustomerLayout>
  );
}
