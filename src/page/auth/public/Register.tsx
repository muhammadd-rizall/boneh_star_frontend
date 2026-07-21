import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Eye, EyeOff, User, Mail, Lock, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCustomerAuthStore } from "@/features/auth/public";
import { useCompanyProfile } from "@/features/admin/company-profile";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const register = useCustomerAuthStore((state) => state.register);
  const { profile: companyProfile } = useCompanyProfile();

  const logoUrl = companyProfile ? resolveMediaUrl(companyProfile.logo) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const { name, email, phone, password } = formData;
      await register({ name, email, phone, password });
      navigate("/customer/bookings");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F3F4F6] p-4 sm:p-6 md:p-8 overflow-x-hidden select-none">
      
      {/* Centered card container for the split-screen layout */}
      <div className="w-full max-w-[1140px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-[#E5E7EB] flex flex-col lg:flex-row overflow-hidden min-h-[640px] lg:min-h-[700px]">
        
        {/* Left Section: Elegant Branding Panel */}
        <div className="lg:w-1/2 relative bg-gradient-to-tr from-[#E6EEF8] via-[#F3F7FC] to-[#EBF3FC] flex flex-col justify-between p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#E5E7EB]">
          
          {/* Ambient light effects for visual interest */}
          <div className="absolute -top-40 -left-40 w-[450px] h-[450px] rounded-full bg-blue-400/10 blur-[100px] pointer-events-none z-0" />
          <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-indigo-400/10 blur-[80px] pointer-events-none z-0" />
          
          {/* Dot matrix pattern top-right */}
          <div className="absolute top-12 right-12 opacity-20 pointer-events-none z-0">
            <div className="grid grid-cols-5 gap-2">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
              ))}
            </div>
          </div>

          {/* Top Logo Section */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={companyProfile?.company_name || "Logo"}
                  className="h-11 w-11 object-contain"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-[#E5E7EB]">
                  {/* Custom Star Logo */}
                  <svg className="h-6 w-6 text-[#0066FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" className="fill-[#0066FF]/10" />
                  </svg>
                </div>
              )}
              <div className="text-left leading-tight">
                <span className="text-lg font-black tracking-tight text-[#0f172a] block">
                  BONEH STAR
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#64748b] block mt-0.5">
                  PARIWISATA
                </span>
              </div>
            </Link>
          </div>

          {/* Middle Content: Large typography */}
          <div className="relative z-10 max-w-md my-auto pt-16 lg:pt-0">
            <h1 className="text-4xl font-extrabold text-[#0f172a] leading-[1.25] tracking-tight">
              Perjalanan <span className="text-[#0066FF]">Nyaman</span>,<br />
              Kenangan Tak Terlupakan.
            </h1>
            
            {/* Divider line under title */}
            <div className="w-12 h-1 bg-[#0066FF] rounded-full mt-5" />

            <p className="text-sm font-semibold text-[#64748b] leading-relaxed mt-6">
              Boneh Star Pariwisata siap menjadi teman perjalanan terbaik Anda untuk setiap momen berharga.
            </p>
          </div>
        </div>

        {/* Right Section: Minimalist Register Form */}
        <div className="lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 bg-white relative z-10">
          
          {/* Card wrapper inside right pane to look exactly like screenshot */}
          <div className="w-full max-w-[420px] bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">
                Daftar Akun
              </h2>
              <p className="text-xs text-[#64748b] mt-2 leading-relaxed font-semibold">
                Daftar sekali untuk pengalaman booking yang lebih ringkas.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 px-4 py-3 text-xs font-semibold text-red-650 animate-in shake duration-500">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name Input */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <div className="relative flex items-center bg-slate-50/50 border border-slate-200 focus-within:border-[#0066FF]/50 focus-within:bg-white rounded-2xl px-4 py-3 transition-all">
                  <User size={16} className="text-slate-400 shrink-0 mr-3" />
                  <input
                    type="text"
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    autoComplete="name"
                    required
                    className="bg-transparent text-xs font-bold text-[#0f172a] placeholder:text-slate-400/70 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative flex items-center bg-slate-50/50 border border-slate-200 focus-within:border-[#0066FF]/50 focus-within:bg-white rounded-2xl px-4 py-3 transition-all">
                  <Mail size={16} className="text-slate-400 shrink-0 mr-3" />
                  <input
                    type="email"
                    placeholder="Masukkan email Anda"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    autoComplete="email"
                    required
                    className="bg-transparent text-xs font-bold text-[#0f172a] placeholder:text-slate-400/70 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  No. Handphone
                </label>
                <div className="relative flex items-center bg-slate-50/50 border border-slate-200 focus-within:border-[#0066FF]/50 focus-within:bg-white rounded-2xl px-4 py-3 transition-all">
                  <Phone size={16} className="text-slate-400 shrink-0 mr-3" />
                  <input
                    type="tel"
                    placeholder="Masukkan nomor handphone Anda"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-transparent text-xs font-bold text-[#0f172a] placeholder:text-slate-400/70 focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative flex items-center bg-slate-50/50 border border-slate-200 focus-within:border-[#0066FF]/50 focus-within:bg-white rounded-2xl px-4 py-3 transition-all">
                  <Lock size={16} className="text-slate-400 shrink-0 mr-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Buat password Anda"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    autoComplete="new-password"
                    required
                    className="bg-transparent text-xs font-bold text-[#0f172a] placeholder:text-slate-400/70 focus:outline-none w-full pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 text-slate-400 hover:text-[#0066FF] transition-colors cursor-pointer"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Konfirmasi Password
                </label>
                <div className="relative flex items-center bg-slate-50/50 border border-slate-200 focus-within:border-[#0066FF]/50 focus-within:bg-white rounded-2xl px-4 py-3 transition-all">
                  <Lock size={16} className="text-slate-400 shrink-0 mr-3" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi password Anda"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    autoComplete="new-password"
                    required
                    className="bg-transparent text-xs font-bold text-[#0f172a] placeholder:text-slate-400/70 focus:outline-none w-full pr-8"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-4 text-slate-400 hover:text-[#0066FF] transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex cursor-pointer items-start gap-2.5 text-xs font-semibold leading-relaxed text-slate-500 pt-1 select-none">
                <input
                  type="checkbox"
                  className="size-4 mt-0.5 rounded border-slate-300 text-[#0066FF] focus:ring-[#0066FF]/15 cursor-pointer"
                  required
                />
                <span>
                  Saya setuju dengan <span className="font-bold text-[#0066FF] hover:underline">syarat layanan</span> dan{" "}
                  <span className="font-bold text-[#0066FF] hover:underline">kebijakan privasi</span>
                </span>
              </label>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                className="h-12 w-full rounded-2xl bg-[#0066FF] hover:bg-[#0052CC] text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-blue-500/10 transition-all mt-6 cursor-pointer"
              >
                Daftar
              </Button>
            </form>

            

            {/* Sign in link */}
            <p className="text-center text-xs font-semibold text-slate-500 mt-6">
              Sudah punya akun?{" "}
              <Link to="/auth/login" className="font-extrabold text-[#0066FF] hover:text-[#0052CC] transition-colors">
                Masuk sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <p className="mt-8 text-center text-xs font-semibold text-slate-400">
        © {new Date().getFullYear()} Boneh Star Pariwisata. Semua hak dilindungi.
      </p>
    </main>
  );
}
