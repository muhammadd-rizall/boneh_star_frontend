import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import { BusFront, LogOut, Menu, User, X, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { useCustomerAuthStore } from "@/features/auth/public";
import Button from "@/components/ui/Button";

const navigation = [
  { label: "Armada", href: "#armada" },
  { label: "Layanan", href: "#services" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "Kontak", href: "#contact" },
];

const customerNavigation = [
  { label: "Booking", to: "/customer/bookings" },
  { label: "Profil", to: "/customer/profile" },
  { label: "Ulasan", to: "/customer/reviews" },
];

interface HeaderProps {
  companyProfile: Pick<CompanyProfile, "company_name" | "logo">;
}

export default function Header({ companyProfile }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isAuthenticated = useCustomerAuthStore((state) => state.isAuthenticated);
  const user = useCustomerAuthStore((state) => state.user);
  const logout = useCustomerAuthStore((state) => state.logout);

  const logoUrl = resolveMediaUrl(companyProfile.logo);

  const handleCustomerLogout = async () => {
    try {
      await logout();
    } catch {
      useCustomerAuthStore.setState({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    } finally {
      setIsOpen(false);
      navigate("/");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm shadow-slate-200/20" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 shadow-lg ${
            isScrolled ? "bg-slate-950 text-white shadow-slate-200" : "bg-white text-slate-950 shadow-black/5"
          }`}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyProfile.company_name}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <BusFront size={22} />
            )}
          </div>
          <span className={`text-xl font-black tracking-tight transition-colors duration-500 ${
            isScrolled || !isHome ? "text-slate-950" : "text-white"
          }`}>
            {companyProfile.company_name}
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {isAuthenticated
            ? customerNavigation.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-bold transition-all rounded-xl ${
                      isScrolled || !isHome
                        ? isActive
                          ? "bg-slate-950 text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                        : isActive
                          ? "bg-white text-slate-950"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))
            : navigation.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-bold transition-all rounded-xl ${
                    isScrolled || !isHome 
                      ? "text-slate-600 hover:bg-slate-50 hover:text-slate-950" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink to="/customer/notifications" className="relative group">
                <div className={`p-2.5 rounded-xl transition-all ${
                  isScrolled || !isHome ? "text-slate-600 hover:bg-slate-50 hover:text-slate-950" : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}>
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
                </div>
              </NavLink>
              <div className="h-6 w-px bg-slate-200 mx-2" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-black tracking-tight ${isScrolled || !isHome ? "text-slate-950" : "text-white"}`}>
                    {user?.name?.split(' ')[0] || "User"}
                  </span>
                  <button onClick={handleCustomerLogout} className="text-[10px] font-bold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-widest">
                    Keluar
                  </button>
                </div>
                <NavLink to="/customer/profile" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
                  <User size={20} className="text-slate-400" />
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  isScrolled || !isHome ? "text-slate-600 hover:text-slate-950" : "text-white/80 hover:text-white"
                }`}
              >
                Masuk
              </NavLink>
              <Button
                size="sm"
                onClick={() => navigate('/auth/register')}
                className={isScrolled || !isHome ? "" : "bg-white text-slate-950 hover:bg-slate-50 shadow-none"}
              >
                Daftar
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all md:hidden ${
            isScrolled || !isHome 
              ? "border-slate-100 bg-white text-slate-700" 
              : "border-white/10 bg-white/5 text-white backdrop-blur-md"
          }`}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="absolute inset-x-0 top-full border-t border-slate-50 bg-white p-4 shadow-2xl md:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
              >
                {item.label}
              </a>
            ))}
            {isAuthenticated && (
              <>
                <div className="my-3 h-px bg-slate-50 mx-4" />
                {customerNavigation.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-4 py-3 text-sm font-bold transition ${
                        isActive ? "bg-orange-50 text-orange-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </>
            )}
            <div className="my-3 h-px bg-slate-50 mx-4" />
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3 p-2">
                <Button variant="outline" size="sm" onClick={() => { setIsOpen(false); navigate('/auth/login'); }}>
                  Masuk
                </Button>
                <Button size="sm" onClick={() => { setIsOpen(false); navigate('/auth/register'); }}>
                  Daftar
                </Button>
              </div>
            ) : (
              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleCustomerLogout} 
                icon={LogOut}
                className="mx-2"
              >
                Keluar
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
