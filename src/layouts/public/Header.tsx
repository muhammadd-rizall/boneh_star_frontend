import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import { BusFront, LogOut, Menu, User, X, Bell } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { useCustomerAuthStore } from "@/features/auth/public";
import { Button } from "@/components/ui/Button";

const navigation = [
  { label: "Armada", href: "/armada" },
  { label: "Layanan", href: "/#services" },
  { label: "Testimoni", href: "/#testimonials" },
  { label: "Kontak", href: "/contact" },
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
  const hasHydrated = useCustomerAuthStore((state) => state.hasHydrated);
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

  // Handle scroll-to-section after navigation from another page
  useEffect(() => {
    if (location.hash) {
      // Small delay to let the page render first
      const timeout = setTimeout(() => {
        const el = document.getElementById(location.hash.replace("#", ""));
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [location]);

  // Smart navigation: smooth scroll if on home, navigate if on other page
  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      const isHashLink = href.startsWith("/#");

      if (isHashLink) {
        const sectionId = href.replace("/#", "");

        if (isHome) {
          // Already on home — just smooth scroll
          e.preventDefault();
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
        }
        // If not on home, let React Router handle navigation to /#section
        // The useEffect above will handle scrolling after navigation
      }

      setIsOpen(false);
    },
    [isHome]
  );

  const navLinkClass = (href: string, isActive: boolean) => {
    const isHashLink = href.startsWith("/#");
    const active = isHashLink ? false : isActive; // hash links are never "active" in router sense

    return `px-3.5 py-2 text-sm font-semibold transition-all rounded-lg ${
      isScrolled || !isHome
        ? active
          ? "bg-slate-900 text-white"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
        : active
          ? "bg-white/15 text-white backdrop-blur-sm"
          : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
        isScrolled
          ? "bg-white/85 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div
            className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl transition-all duration-400 ${
              isScrolled
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white/10 backdrop-blur-sm text-white border border-white/10"
            }`}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyProfile.company_name}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <BusFront size={20} />
            )}
          </div>
          <span
            className={`text-lg font-bold tracking-tight transition-colors duration-400 ${
              isScrolled || !isHome ? "text-slate-900" : "text-white"
            }`}
          >
            {companyProfile.company_name}
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {hasHydrated && isAuthenticated
            ? customerNavigation.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-sm font-semibold transition-all rounded-lg ${
                      isScrolled || !isHome
                        ? isActive
                          ? "bg-slate-900 text-white"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        : isActive
                          ? "bg-white/15 text-white backdrop-blur-sm"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))
            : navigation.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={({ isActive }) => navLinkClass(item.href, isActive)}
                >
                  {item.label}
                </NavLink>
              ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          {hasHydrated && isAuthenticated ? (
            <>
              <NavLink to="/customer/notifications" className="relative group">
                <div
                  className={`p-2 rounded-lg transition-all ${
                    isScrolled || !isHome
                      ? "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white" />
                </div>
              </NavLink>
              <div className={`h-5 w-px mx-1 ${isScrolled || !isHome ? "bg-slate-100" : "bg-white/10"}`} />
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold ${isScrolled || !isHome ? "text-slate-900" : "text-white"}`}>
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <button
                    onClick={handleCustomerLogout}
                    className="text-[10px] font-semibold text-slate-400 hover:text-orange-500 transition-colors uppercase tracking-wider"
                  >
                    Keluar
                  </button>
                </div>
                <NavLink
                  to="/customer/profile"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 border border-slate-50 overflow-hidden"
                >
                  <User size={16} className="text-slate-400" />
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                className={`px-3.5 py-2 text-sm font-semibold transition-colors rounded-lg ${
                  isScrolled || !isHome
                    ? "text-slate-500 hover:text-slate-900"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Masuk
              </NavLink>
              <Button
                size="sm"
                onClick={() => navigate("/auth/register")}
                className={`rounded-lg ${
                  isScrolled || !isHome
                    ? ""
                    : "bg-white text-slate-900 hover:bg-white/90 shadow-none border-white"
                }`}
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
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-all md:hidden ${
            isScrolled || !isHome
              ? "border-slate-100 bg-white text-slate-700"
              : "border-white/10 bg-white/5 text-white backdrop-blur-md"
          }`}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="absolute inset-x-0 top-full border-t border-slate-50 bg-white p-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    !item.href.startsWith("/#") && isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <>
                <div className="my-2 h-px bg-slate-50 mx-4" />
                {customerNavigation.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? "bg-orange-50 text-orange-600"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </>
            )}
            <div className="my-2 h-px bg-slate-50 mx-4" />
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/auth/login");
                  }}
                >
                  Masuk
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/auth/register");
                  }}
                >
                  Daftar
                </Button>
              </div>
            ) : (
              <Button
                variant="destructive"
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
