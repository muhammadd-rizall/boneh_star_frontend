import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { authService } from '@/features/auth/public/services/AuthService';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (tokenParam) setToken(tokenParam);
    if (emailParam) setEmail(emailParam);

    if (!tokenParam) {
      setError('Token reset password tidak valid atau sudah kadaluarsa.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (password !== passwordConfirmation) {
      setError('Konfirmasi password tidak cocok.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setSuccess(response.message || 'Password Anda berhasil diperbarui.');
      setTimeout(() => navigate('/auth/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memperbarui password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="flex min-h-[85vh] items-center justify-center px-4 pt-32 pb-20">
        <div className="w-full max-w-[440px]">
          <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl font-black tracking-tighter text-slate-950">
              Reset <span className="text-orange-500">Password</span>
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Masukkan password baru Anda di bawah ini
            </p>
          </div>

          <Card className="p-10 border-none shadow-2xl shadow-slate-200/60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {success ? (
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Berhasil!</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                  {success}
                </p>
                <p className="text-xs text-slate-400">
                  Anda akan dialihkan ke halaman login dalam beberapa detik...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {error && (
                  <div className="flex items-center gap-3 rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-600 border border-rose-100 animate-in shake duration-500">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-bold">{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <Input
                    label="Password Baru"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-2xl border-slate-100 focus:border-orange-500 transition-all"
                    required
                  />

                  <Input
                    label="Konfirmasi Password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="rounded-2xl border-slate-100 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  loading={loading} 
                  size="lg" 
                  className="w-full shadow-lg shadow-slate-200" 
                  suffix={ArrowRight}
                  disabled={!token}
                >
                  Perbarui Password
                </Button>
              </form>
            )}

            {!success && (
              <div className="mt-10 border-t border-slate-50 pt-8 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  Batal reset password?{' '}
                  <Link to="/auth/login" className="font-black text-orange-600 hover:text-orange-500 transition-colors">
                    Kembali ke Login
                  </Link>
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
