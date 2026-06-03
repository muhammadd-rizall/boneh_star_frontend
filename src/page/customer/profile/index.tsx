import { useState } from 'react';
import CustomerLayout from '@/layouts/customer/CustomerLayout';
import { useProfile } from '@/features/customer/profile/hooks/useProfile';
import ProfileInfo from '@/features/customer/profile/components/ProfileInfo';
import ProfileEditForm from '@/features/customer/profile/components/ProfileEditForm';
import PasswordChangeForm from '@/features/customer/profile/components/PasswordChangeForm';
import BookingStats from '@/features/customer/profile/components/BookingStats';
import { Card } from '@/components/ui/Card';
import Loader from '@/components/feedback/Loader';
import ErrorState from '@/components/feedback/ErrorState';

export default function ProfilePage() {
  const { profile, statistics, loading, error, updateProfile, updatePassword, uploadPicture, refresh } = useProfile();

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
        <h1 className="text-2xl font-black tracking-tight text-midnight-indigo sm:text-3xl">
          Profil <span className="text-action-blue">Akun</span>
        </h1>
        <p className="text-sm font-medium text-slate-blue">
          Kelola informasi pribadi dan lihat ringkasan aktivitas Anda.
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {/* Statistics Section */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Statistik Aktivitas</h2>
          {statistics && <BookingStats statistics={statistics} />}
        </div>

        {/* Dynamic Content Section */}
        <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          <div className="flex flex-col gap-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Informasi Pribadi</h2>
            <ProfileInfo
              profile={profile}
              onUpload={uploadPicture}
            />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Edit Profil Akun</h2>
            <Card className="p-6 sm:p-8 border border-platinum-tint shadow-sm rounded-[16px] bg-white">
              <ProfileEditForm
                profile={profile}
                onSubmit={async (data) => {
                  await updateProfile(data);
                }}
              />
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-blue/60 ml-1">Ganti Password</h2>
            <Card className="p-6 sm:p-8 border border-platinum-tint shadow-sm rounded-[16px] bg-white">
              <PasswordChangeForm
                onSubmit={async (data) => {
                  await updatePassword(data);
                }}
              />
            </Card>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
