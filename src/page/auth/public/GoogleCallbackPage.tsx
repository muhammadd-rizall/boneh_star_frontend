import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCustomerAuthStore } from '@/features/auth/public';
import Loader from '@/components/feedback/Loader';
import { useToastStore } from '@/store/useToastStore';

export default function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userJson = searchParams.get('user');
    const errorMsg = searchParams.get('error');

    if (errorMsg) {
      showError(decodeURIComponent(errorMsg));
      navigate('/auth/login', { replace: true });
      return;
    }

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));
        useCustomerAuthStore.setState({
          token,
          user,
          isAuthenticated: true,
          hasHydrated: true,
        });
        showSuccess('Berhasil masuk dengan Google!');
        navigate('/customer/bookings/request', { replace: true });
      } catch (err) {
        console.error('Failed to parse Google user payload:', err);
        showError('Gagal memproses sesi login Google.');
        navigate('/auth/login', { replace: true });
      }
    } else {
      showError('Token autentikasi Google tidak ditemukan.');
      navigate('/auth/login', { replace: true });
    }
  }, [searchParams, navigate, showSuccess, showError]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F3F4F6]">
      <Loader text="Memproses login Google..." />
    </div>
  );
}
