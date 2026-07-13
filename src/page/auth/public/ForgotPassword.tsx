import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '@/features/auth/public/services/AuthService';
import { Button } from '@/components/ui/Button';
import { useCompanyProfile } from '@/features/admin/company-profile';
import { resolveMediaUrl } from '@/features/admin/company-profile/utils/companyProfileUtils';
import { Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { profile: companyProfile } = useCompanyProfile();
  const logoUrl = companyProfile ? resolveMediaUrl(companyProfile.logo) : null;

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
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50 px-4 py-12 overflow-hidden select-none">
      {/* Decorative Blue Background Grids & Circles */}
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none z-0">
        <svg width="120" height="120" fill="currentColor" className="text-action-blue">
          <pattern id="dot-pattern-top" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" />
          </pattern>
          <rect width="120" height="120" fill="url(#dot-pattern-top)" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 p-8 opacity-10 pointer-events-none z-0">
        <svg width="120" height="120" fill="currentColor" className="text-action-blue">
          <pattern id="dot-pattern-bottom" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" />
          </pattern>
          <rect width="120" height="120" fill="url(#dot-pattern-bottom)" />
        </svg>
      </div>

      <div className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full bg-action-blue/5 blur-3xl pointer-events-none z-0" />
      <div className="absolute -bottom-24 -right-24 w-[380px] h-[380px] rounded-full bg-action-blue/5 blur-3xl pointer-events-none z-0" />

      {/* Main Forgot Password Card */}
      <div className="relative z-10 w-full max-w-[480px] bg-white rounded-3xl border border-slate-100 shadow-[0_12px_40px_rgba(71,103,136,0.06)] p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* Logo and Brand Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyProfile?.company_name || "Logo"}
                className="h-10 object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <svg className="h-9 w-9 text-action-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" className="fill-action-blue/15" />
                </svg>
                <span className="text-xl font-black tracking-tight text-midnight-indigo">
                  Boneh <span className="text-action-blue">Star</span>
                </span>
              </div>
            )}
            {!logoUrl && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-blue/60 mt-1 self-end mb-1">
                Pariwisata
              </span>
            )}
          </Link>

          <h2 className="text-2xl font-black text-midnight-indigo mt-6">
            Lupa Password
          </h2>
          <p className="text-xs font-semibold text-slate-blue/80 mt-2 leading-relaxed">
            Masukkan email Anda untuk menerima tautan reset password.
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 size={28} />
              </div>
            </div>
            <h3 className="text-lg font-extrabold text-midnight-indigo">Email Terkirim!</h3>
            <p className="text-xs font-semibold text-slate-blue/70 leading-relaxed">
              {success}
            </p>
            <Link to="/auth/login" className="block w-full">
              <Button className="h-12 w-full rounded-2xl bg-action-blue hover:bg-action-blue-dark text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-action-blue/15 transition-all">
                Kembali ke Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3 text-xs font-bold text-red-600 animate-in shake duration-500">
                <AlertCircle className="mt-0.5 size-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-midnight-indigo uppercase tracking-wider">
                Email
              </label>
              <div className="relative flex items-center bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:border-action-blue/50 focus-within:bg-white transition-all">
                <Mail size={16} className="text-slate-blue/70 shrink-0 mr-3" />
                <input
                  type="email"
                  placeholder="Masukkan email terdaftar Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="bg-transparent text-xs font-bold text-midnight-indigo placeholder:text-slate-blue/40 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              loading={loading}
              size="lg"
              className="h-12 w-full rounded-2xl bg-action-blue hover:bg-action-blue-dark text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-action-blue/15 transition-all mt-4"
              suffix={ArrowRight}
            >
              Kirim Tautan Reset
            </Button>
          </form>
        )}

        {/* Back to Login link */}
        {!success && (
          <div className="mt-8 border-t border-slate-50 pt-6 text-center">
            <p className="text-xs font-semibold text-slate-blue/70">
              Ingat password Anda?{' '}
              <Link to="/auth/login" className="font-extrabold text-action-blue hover:text-action-blue-dark transition-colors">
                Masuk sekarang
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Footer Copyright */}
      <p className="relative z-10 mt-8 text-center text-[10px] font-bold tracking-wider text-slate-blue/40 uppercase">
        © 2025 {companyProfile?.company_name || 'Boneh Star Pariwisata'}. Semua hak dilindungi.
      </p>
    </main>
  );
}
