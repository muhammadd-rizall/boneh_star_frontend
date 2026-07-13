import React, { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Header from "../public/Header";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { useNotifications } from "@/features/customer/notifications/hooks/useNotifications";
import { useCustomerAuthStore } from "@/features/auth/public";
import { useProfile } from "@/features/customer/profile/hooks/useProfile";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import WhatsAppFloating from "../public/WhatsAppFloating";
import { cn } from "@/lib/utils";
import ToastContainer from "@/components/feedback/ToastContainer";
import {
  Home, CalendarCheck, CalendarPlus, MessageSquare, Bell,
  User, LogOut, Headphones, ChevronDown
} from "lucide-react";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const { profile } = usePublicCompanyProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { unreadCount } = useNotifications();
  const logout = useCustomerAuthStore((s) => s.logout);
  const customerAuthUser = useCustomerAuthStore((s) => s.user);
  
  // Fetch fresh profile data (e.g. name, profile_picture)
  const { profile: customerProfile } = useProfile();
  const activeUser = customerProfile || customerAuthUser;

  // Accordion state for Pemesanan submenu
  const isBookingsRoute = location.pathname === '/customer/bookings';
  const [isPemesananOpen, setIsPemesananOpen] = useState(isBookingsRoute);

  // Keep accordion open if on bookings page
  useEffect(() => {
    if (isBookingsRoute) {
      setIsPemesananOpen(true);
    }
  }, [location.pathname, isBookingsRoute]);

  const activeTab = searchParams.get('tab') ?? 'stats';

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Direct logout fallback
      useCustomerAuthStore.setState({ user: null, token: null, isAuthenticated: false });
    } finally {
      navigate('/');
    }
  };

  // Helper check for sub-item active state
  const isSubActive = (tab: string) => {
    return isBookingsRoute && activeTab === tab;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-900 font-sans">
      <ToastContainer />
      {/* Header Utama (Public/Customer Header) */}
      <Header companyProfile={profile || { company_name: "Boneh Star", logo: "" }} />

      {/* Main Layout Wrapper dengan pt-[72px] untuk tinggi header */}
      <div className="flex pt-[72px]">
        
        {/* ── Sidebar Container (Desktop Only) ── */}
        <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-pale-gray/50 fixed top-[72px] bottom-0 left-0 z-40 overflow-y-auto">
          
          {/* User Card */}
          <div className="px-5 py-4 flex items-center gap-3 border-b border-pale-gray/40 shrink-0">
            <div className="h-10 w-10 rounded-full overflow-hidden border border-pale-gray/50 bg-cloud-mist shrink-0">
              {activeUser?.profile_picture ? (
                <img
                  src={resolveMediaUrl(activeUser.profile_picture)}
                  alt={activeUser.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-action-blue text-sm font-black text-white">
                  {activeUser?.name?.charAt(0).toUpperCase() || 'P'}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-xs font-black text-gray-900 truncate leading-tight">
                {activeUser?.name || 'Rizal Putra'}
              </p>
              <p className="text-[10px] text-slate-blue font-bold mt-0.5">Pelanggan</p>
            </div>
          </div>

          {/* Menu Navigation */}
          <div className="flex flex-col flex-1 py-5 px-4 overflow-y-auto">
            
            {/* ── Beranda ── */}
            <Link
              to="/"
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                location.pathname === '/'
                  ? "bg-emerald-50/70 text-emerald-800"
                  : "text-slate-blue hover:text-gray-900 hover:bg-cloud-mist"
              )}
            >
              <Home size={18} className={location.pathname === '/' ? "text-emerald-700" : "text-steel-gray"} />
              <span>Beranda</span>
            </Link>

            {/* ── PEMESANAN GROUP ── */}
            <div className="mt-6">
              <p className="px-4 mb-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-steel-gray">
                Pemesanan
              </p>

              <nav className="flex flex-col gap-1">
                {/* Pemesanan Accordion Trigger */}
                <div>
                  <button
                    onClick={() => setIsPemesananOpen(!isPemesananOpen)}
                    className={cn(
                      "flex w-full items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer",
                      isBookingsRoute && !['stats', 'pending', 'offers', 'history'].includes(activeTab)
                        ? "bg-emerald-50/70 text-emerald-800"
                        : "text-slate-blue hover:text-gray-900 hover:bg-cloud-mist"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarCheck size={18} className={isBookingsRoute ? "text-emerald-700" : "text-steel-gray"} />
                      <span>Pemesanan</span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={cn("text-steel-gray transition-transform duration-200", isPemesananOpen && "rotate-180")}
                    />
                  </button>

                  {/* Submenu */}
                  {isPemesananOpen && (
                    <div className="pl-4 ml-6 border-l border-pale-gray/80 mt-1 flex flex-col gap-1.5 py-1">
                      <Link
                        to="/customer/bookings?tab=stats"
                        className={cn(
                          "block py-1.5 text-xs font-bold transition-all",
                          isSubActive('stats') ? "text-emerald-800" : "text-slate-blue hover:text-gray-900"
                        )}
                      >
                        Statistik
                      </Link>
                      <Link
                        to="/customer/bookings?tab=pending"
                        className={cn(
                          "block py-1.5 text-xs font-bold transition-all",
                          isSubActive('pending') ? "text-emerald-800" : "text-slate-blue hover:text-gray-900"
                        )}
                      >
                        Pengajuan
                      </Link>
                      <Link
                        to="/customer/bookings?tab=offers"
                        className={cn(
                          "block py-1.5 text-xs font-bold transition-all",
                          isSubActive('offers') ? "text-emerald-800" : "text-slate-blue hover:text-gray-900"
                        )}
                      >
                        Penawaran
                      </Link>
                      <Link
                        to="/customer/bookings?tab=history"
                        className={cn(
                          "block py-1.5 text-xs font-bold transition-all",
                          isSubActive('history') ? "text-emerald-800" : "text-slate-blue hover:text-gray-900"
                        )}
                      >
                        Riwayat
                      </Link>
                    </div>
                  )}
                </div>

                {/* Buat Pemesanan */}
                <Link
                  to="/customer/bookings/request"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                    location.pathname === '/customer/bookings/request'
                      ? "bg-emerald-50/70 text-emerald-800"
                      : "text-slate-blue hover:text-gray-900 hover:bg-cloud-mist"
                  )}
                >
                  <CalendarPlus size={18} className={location.pathname === '/customer/bookings/request' ? "text-emerald-700" : "text-steel-gray"} />
                  <span>Buat Pemesanan</span>
                </Link>

                {/* Ulasan Saya */}
                <Link
                  to="/customer/reviews"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                    location.pathname === '/customer/reviews'
                      ? "bg-emerald-50/70 text-emerald-800"
                      : "text-slate-blue hover:text-gray-900 hover:bg-cloud-mist"
                  )}
                >
                  <MessageSquare size={18} className={location.pathname === '/customer/reviews' ? "text-emerald-700" : "text-steel-gray"} />
                  <span>Ulasan Saya</span>
                </Link>

                {/* Notifikasi */}
                <Link
                  to="/customer/notifications"
                  className={cn(
                    "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                    location.pathname === '/customer/notifications'
                      ? "bg-emerald-50/70 text-emerald-800"
                      : "text-slate-blue hover:text-gray-900 hover:bg-cloud-mist"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Bell size={18} className={location.pathname === '/customer/notifications' ? "text-emerald-700" : "text-steel-gray"} />
                    <span>Notifikasi</span>
                  </div>
                  {unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </nav>
            </div>

            {/* ── AKUN GROUP ── */}
            <div className="mt-6">
              <p className="px-4 mb-2.5 text-[10px] font-black uppercase tracking-[0.15em] text-steel-gray">
                Akun
              </p>

              <nav className="flex flex-col gap-1">
                {/* Profil Akun */}
                <Link
                  to="/customer/profile"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                    location.pathname === '/customer/profile'
                      ? "bg-[#EAF5F0] text-[#0E5F38]"
                      : "text-slate-blue hover:text-gray-900 hover:bg-cloud-mist"
                  )}
                >
                  <User size={18} className={location.pathname === '/customer/profile' ? "text-[#0E5F38]" : "text-steel-gray"} />
                  <span>Profil Akun</span>
                </Link>
              </nav>
            </div>

            <div className="flex-1" />

            {/* Keluar */}
            <button
              onClick={handleLogout}
              className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-blue hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <LogOut size={18} />
              <span>Keluar</span>
            </button>

            {/* Help box */}
            <div className="mt-5 rounded-2xl border border-pale-gray/80 bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-gray-900 mb-1">Butuh Bantuan?</p>
              <p className="text-[10px] text-slate-blue font-semibold leading-relaxed mb-3">
                Tim kami siap membantu Anda jika mengalami kendala.
              </p>
              <button
                onClick={() => {
                  if (profile?.whatsapp?.[0]) {
                    window.open(`https://wa.me/${profile.whatsapp[0].replace(/\D/g, "")}`, "_blank");
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600/30 text-emerald-700 bg-white hover:bg-emerald-50/50 py-2.5 text-xs font-bold transition-colors cursor-pointer"
              >
                <Headphones size={13} className="stroke-[2.5]" />
                Hubungi Kami
              </button>
            </div>

          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 lg:ml-[260px] min-h-[calc(100vh-72px)] bg-[#F5F7FA] overflow-x-hidden">
          <div className="px-4 sm:px-6 lg:px-8 py-6 pb-20 max-w-7xl mx-auto">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </main>
      </div>

      <WhatsAppFloating whatsapp={profile?.whatsapp || []} />
    </div>
  );
}
