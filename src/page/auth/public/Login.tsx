import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCustomerAuthStore } from '@/features/auth/public';
import { Button } from '@/components/ui/Button';
import { ArrowRight, AlertCircle, BusFront } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const login = useCustomerAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/customer/bookings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E6F0FF] p-4 font-sans text-[#0B3558]">
      <div className="relative flex w-full max-w-[1000px] overflow-hidden rounded-[32px] bg-white shadow-2xl ring-1 ring-black/5 flex-col md:flex-row min-h-[640px]">
        
        {/* Sisi Kiri - Branding & Ilustrasi */}
        <div className="relative w-full bg-[#1A68D1] p-8 md:w-[45%] md:p-12 lg:p-16 overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 h-full w-full pointer-events-none hidden md:block">
            <svg className="absolute -right-px h-full w-32 fill-white" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M100 0 L100 100 L40 100 C 70 80 70 20 40 0 Z" />
            </svg>
            <svg className="absolute right-12 h-full w-24 fill-white/10" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M100 0 C 60 20 60 80 100 100 Z" />
            </svg>
            <svg className="absolute right-20 h-full w-20 fill-white/10" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M100 10 C 70 30 70 70 100 90 Z" />
            </svg>
          </div>

          <div className="relative z-10 animate-in fade-in slide-in-from-top-4 duration-700">
             <h2 className="text-xl font-bold text-white/90">Selamat Datang di</h2>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-1000 delay-200">
             <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-xl ring-8 ring-white/10 transition-transform hover:scale-105 duration-500">
                <BusFront className="h-16 w-16 text-[#1A68D1]" strokeWidth={1.5} />
             </div>
             <h1 className="text-4xl font-black tracking-tight text-white">BonehStar</h1>
             <p className="mt-6 max-w-xs text-sm font-medium leading-relaxed text-white/80">
                Masuk ke akun Anda untuk menikmati fitur premium dan tetap terupdate dengan layanan terbaru kami. Bergabunglah dengan komunitas kami sekarang!
             </p>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
             <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
             <span className="h-4 w-px bg-white/20" />
             <Link to="/auth/register" className="hover:text-white transition-colors">Daftar Akun</Link>
          </div>
        </div>

        {/* Sisi Kanan - Form */}
        <div className="w-full bg-white p-8 md:w-[55%] md:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center animate-in fade-in slide-in-from-right-4 duration-700">
            <h2 className="text-2xl font-black tracking-tight lg:text-3xl">
              Masuk ke akun Anda
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            {error && (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-600 border border-rose-100">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            <div className="space-y-5">
               <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold ml-1 uppercase tracking-wider opacity-70">Email</label>
                  <input
                    type="email"
                    placeholder="Masukkan email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-none bg-[#F0F5FF] h-12 px-5 text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-blue-500/10 placeholder:text-[#A6BBD1]"
                    required
                  />
               </div>

               <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-bold ml-1 uppercase tracking-wider opacity-70">Kata Sandi</label>
                  <input
                    type="password"
                    placeholder="Masukkan Kata Sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border-none bg-[#F0F5FF] h-12 px-5 text-sm font-medium outline-none transition-all focus:ring-4 focus:ring-blue-500/10 placeholder:text-[#A6BBD1]"
                    required
                  />
               </div>
            </div>

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="remember" 
                className="h-5 w-5 cursor-pointer rounded-md border-[#D4E0ED] text-[#1A68D1] focus:ring-[#1A68D1]/20 transition-all" 
              />
              <label htmlFor="remember" className="cursor-pointer text-xs font-bold text-slate-400 select-none">
                Ingat perangkat ini
              </label>
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              size="lg" 
              className="w-full mt-2 h-14 rounded-xl bg-[#1A68D1] text-white text-base font-black shadow-lg shadow-blue-200 transition-all hover:bg-[#1559B0] active:translate-y-px"
            >
              Masuk
            </Button>
          </form>

          <div className="mt-12 animate-in fade-in duration-1000 delay-500 text-center">
            <div className="relative flex items-center justify-center">
               <span className="absolute inset-x-0 h-px bg-slate-100" />
               <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                  Atau Masuk dengan
               </span>
            </div>

            <div className="mt-8 flex justify-center gap-6">
               <button 
                 type="button"
                 className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 hover:bg-slate-50 transition-colors group"
                 aria-label="Masuk dengan Google"
               >
                 <FontAwesomeIcon icon={faGoogle} className="text-[#DB4437] text-2xl" />
               </button>
            </div>

            <p className="mt-10 text-sm font-semibold text-slate-400">
              Belum punya akun?{' '}
              <Link to="/auth/register" className="font-black text-[#1A68D1] hover:underline ml-1">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
