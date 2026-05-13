import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '@/layouts/public/PublicLayout';
import { authService } from '@/features/auth/public/services/AuthService';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.forgotPassword({ email });
      setSuccess(response.message || 'Tautan reset password telah dikirim ke email Anda.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengirim tautan reset password.');
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
              Lupa <span className="text-orange-500">Password</span>
            </h1>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Masukkan email Anda untuk menerima tautan reset password
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
                <h2 className="text-xl font-bold text-slate-900 mb-2">Email Terkirim!</h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  {success}
                </p>
                <Link to="/auth/login">
                  <Button className="w-full">
                    Kembali ke Login
                  </Button>
                </Link>
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
                    label="Alamat Email"
                    type="email"
                    placeholder="name@example.com"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                >
                  Kirim Tautan Reset
                </Button>
              </form>
            )}

            {!success && (
              <div className="mt-10 border-t border-slate-50 pt-8 text-center">
                <p className="text-sm font-semibold text-slate-500">
                  Ingat password Anda?{' '}
                  <Link to="/auth/login" className="font-black text-orange-600 hover:text-orange-500 transition-colors">
                    Masuk Sekarang
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
