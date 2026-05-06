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
      
      <main className="mx-auto max-w-7xl px-4 pt-32 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="flex flex-col gap-1 rounded-3xl bg-white p-2 border border-slate-100 shadow-sm">
              {sidebarNavigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all group ${
                      isActive 
                        ? "bg-slate-950 text-white shadow-md shadow-slate-200" 
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  <ChevronRight size={14} className={`opacity-0 transition-all group-hover:opacity-100 ${location.pathname === item.to ? "hidden" : ""}`} />
                </NavLink>
              ))}
            </nav>
            
            <div className="mt-6 rounded-3xl bg-orange-600 p-6 text-white shadow-xl shadow-orange-600/20">
              <h4 className="font-bold">Butuh Bantuan?</h4>
              <p className="mt-2 text-xs font-medium text-orange-100 leading-relaxed">
                Tim support kami siap membantu Anda 24/7 untuk urusan pemesanan.
              </p>
              <button className="mt-4 w-full rounded-xl bg-white px-4 py-2 text-xs font-bold text-orange-600 transition-colors hover:bg-orange-50">
                Hubungi Kami
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <div className="flex-1">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer companyProfile={profile} />
    </div>
  );
}
