import type { ReactNode } from "react";
import Header from "../public/Header";
import Footer from "../public/Footer";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  MessageSquare, 
  Bell, 
  ChevronRight
} from "lucide-react";

import WhatsAppFloating from "../public/WhatsAppFloating";

interface CustomerLayoutProps {
  children: ReactNode;
}

const sidebarNavigation = [
  { label: "Dashboard Booking", to: "/customer/bookings", icon: LayoutDashboard },
  { label: "Profil Akun", to: "/customer/profile", icon: User },
  { label: "Ulasan Saya", to: "/customer/reviews", icon: MessageSquare },
  { label: "Notifikasi", to: "/customer/notifications", icon: Bell },
];

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  const { profile } = usePublicCompanyProfile();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header companyProfile={profile} />
      
      <main className="mx-auto w-full max-w-7xl px-4 pt-[120px] pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row items-start">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 lg:min-w-[256px] flex-shrink-0">
            <nav className="flex flex-col gap-2 rounded-[16px] bg-white p-4 shadow-card">
              {sidebarNavigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 text-[16px] font-semibold transition-colors group ${
                      isActive 
                        ? "text-action-blue" 
                        : "text-midnight-indigo hover:text-action-blue"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} strokeWidth={location.pathname === item.to ? 2.5 : 2} />
                    {item.label}
                  </div>
                  <ChevronRight size={16} className={`opacity-0 transition-transform group-hover:opacity-100 group-hover:translate-x-1 ${location.pathname === item.to ? "hidden" : ""}`} />
                </NavLink>
              ))}
            </nav>
            
            <div className="mt-8 rounded-[16px] bg-white p-6 shadow-card relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cloud-mist rounded-full blur-2xl group-hover:bg-platinum-tint/50 transition-colors duration-700" />
              <h4 className="font-bold text-[18px] text-midnight-indigo relative z-10 tracking-tight">Butuh Bantuan?</h4>
              <p className="mt-2 text-[14px] font-medium text-slate-blue leading-[1.71] relative z-10">
                Tim support kami siap membantu Anda 24/7 untuk urusan pemesanan.
              </p>
              <button className="mt-6 w-full rounded-[8px] bg-action-blue px-4 py-3 text-[14px] font-bold text-white shadow-button transition-all hover:bg-action-blue/90 hover:scale-[1.02] active:scale-95 relative z-10">
                Hubungi Kami
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1 min-w-0 w-full">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </div>
      </main>

      <WhatsAppFloating whatsapp={profile?.whatsapp || []} />
      <Footer companyProfile={profile} />
    </div>
  );
}
