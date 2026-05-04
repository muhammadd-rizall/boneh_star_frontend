import { useState } from 'react';
import PublicLayout from '@/layouts/public/PublicLayout';
import { useProfile } from '@/features/customer/profile/hooks/useProfile';
import ProfileInfo from '@/features/customer/profile/components/ProfileInfo';
import ProfileEditForm from '@/features/customer/profile/components/ProfileEditForm';
import BookingStats from '@/features/customer/profile/components/BookingStats';
import Modal from '@/components/ui/Modal';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';
import { Section, Container } from '@/components/ui/PageComponents';

export default function ProfilePage() {
  const { profile, statistics, loading, error, updateProfile, uploadPicture, refresh } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader />
        </div>
      </PublicLayout>
    );
  }

  if (error || !profile) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <ErrorState message={error || 'Profil tidak ditemukan'} onRetry={refresh} />
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
              Profil <span className="text-orange-600">Akun</span>
            </h1>
            <p className="max-w-2xl text-lg font-medium text-slate-500">
              Kelola informasi pribadi Anda dan pantau riwayat pemesanan di Boneh Star.
            </p>
          </div>

          <div className="flex flex-col gap-10">
            {/* Statistics Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Statistik Pemesanan</h2>
              {statistics && <BookingStats statistics={statistics} />}
            </div>

            {/* Profile Info Section */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Informasi Pribadi</h2>
              <ProfileInfo
                profile={profile}
                onEdit={() => setIsEditModalOpen(true)}
                onUpload={uploadPicture}
              />
            </div>
          </div>
        </Container>
      </Section>

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
    </PublicLayout>
  );
}
