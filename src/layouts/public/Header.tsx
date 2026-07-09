import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import { BusFront, LogOut, Menu, User, X, Bell } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { useCustomerAuthStore } from "@/features/auth/public";
import { Button } from "@/components/ui/Button";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Armada", href: "/armada" },
  { label: "Tentang Kami", href: "/tentang-kami" },
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

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace("#", "");
      let retries = 0;
      
      const tryScroll = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 150);
        } else if (retries < 15) {
          retries++;
          setTimeout(tryScroll, 100);
        }
      };
      
      tryScroll();
    }
  }, [location.pathname, location.hash]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      const isHashLink = href.startsWith("/#");

      if (isHashLink) {
        const sectionId = href.replace("/#", "");

        if (isHome) {
          e.preventDefault();
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          }
          window.history.pushState(null, "", href);
        }
      }
      setIsOpen(false);
    },
    [isHome]
  );

  const isTransparentDark = !isScrolled && isHome;

  const navLinkClass = (href: string, isActive: boolean) => {
    const isHashLink = href.startsWith("/#");
    const active = isHashLink ? false : isActive;

    return "px-3 py-1.5 text-[14px] font-medium transition-colors rounded-md " + (
      isTransparentDark
        ? (active ? "text-white" : "text-white/80 hover:text-white")
        : (active ? "text-action-blue" : "text-midnight-indigo hover:text-action-blue")
    );
  };

  return (
    <header
      className={"fixed top-0 inset-x-0 z-50 transition-all duration-300 " + (
        isScrolled || !isHome
          ? "bg-white/95 backdrop-blur-xl border-b border-platinum-tint py-3 shadow-sm"
          : "bg-transparent py-5"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div
            className={"flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 " + (
              isScrolled
                ? "bg-midnight-indigo text-white shadow-sm"
                : "bg-white/10 backdrop-blur-sm text-white border border-white/20"
            )}
          >
            {logoUrl ? (
              <img
                key="header-logo-img"
                src={logoUrl}
                alt={companyProfile.company_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <BusFront key="header-logo-icon" size={20} />
            )}
          </div>
          <span
            className={
              "text-lg font-bold tracking-tight transition-colors duration-300 " +
              (isTransparentDark ? "text-white" : "text-midnight-indigo")
            }
          >
            {companyProfile.company_name}
          </span>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {hasHydrated && isAuthenticated
            ? customerNavigation.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => navLinkClass(item.to, isActive)}
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

        <div className="hidden items-center gap-4 md:flex">
          {hasHydrated && isAuthenticated ? (
            <>
              <NavLink to="/customer/notifications" className="relative group">
                <div
                  className={"p-2 rounded-md transition-colors " + (
                    isTransparentDark
                      ? "text-white/80 hover:text-white"
                      : "text-slate-blue hover:text-action-blue"
                  )}
                >
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-action-blue shadow-sm" />
                </div>
              </NavLink>
              <div className={"h-4 w-px " + (isTransparentDark ? "bg-white/20" : "bg-platinum-tint")} />
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className={"text-xs font-bold " + (isTransparentDark ? "text-white" : "text-midnight-indigo")}>
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <button
                    onClick={handleCustomerLogout}
                    className="text-[10px] font-medium text-slate-blue hover:text-red-500 transition-colors"
                  >
                    Keluar
                  </button>
                </div>
                <NavLink
                  to="/customer/profile"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-cloud-mist border border-platinum-tint overflow-hidden hover:border-action-blue transition-colors"
                >
                  {user?.profile_picture ? (
                    <img src={resolveMediaUrl(user.profile_picture)} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <User size={16} className="text-slate-blue" />
                  )}
                </NavLink>
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                className={
                  "px-4 py-2 text-[14px] font-semibold transition-colors rounded-lg " +
                  (isTransparentDark
                    ? "text-white/90 hover:text-white"
                    : "text-midnight-indigo hover:text-action-blue")
                }
              >
                Masuk
              </NavLink>
              <Button
                size="sm"
                onClick={() => navigate("/auth/register")}
                className={"rounded-lg font-bold " + (
                  isTransparentDark
                    ? "bg-white text-midnight-indigo hover:bg-white/90"
                    : "bg-action-blue text-white shadow-button"
                )}
              >
                Daftar
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className={"inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors md:hidden " + (
            isTransparentDark
              ? "border-white/20 bg-white/10 text-white backdrop-blur-md"
              : "border-platinum-tint bg-white text-midnight-indigo shadow-sm"
          )}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute inset-x-0 top-full border-t border-platinum-tint bg-white p-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.label}
                to={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={({ isActive }) =>
                  "rounded-lg px-4 py-3 text-sm font-semibold transition-colors " + (
                    !item.href.startsWith("/#") && isActive
                      ? "bg-cloud-mist text-action-blue"
                      : "text-midnight-indigo hover:bg-cloud-mist hover:text-action-blue"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <>
                <div className="my-2 h-px bg-platinum-tint mx-4" />
                {customerNavigation.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      "rounded-lg px-4 py-3 text-sm font-semibold transition-colors " + (
                        isActive
                          ? "bg-cloud-mist text-action-blue"
                          : "text-midnight-indigo hover:bg-cloud-mist hover:text-action-blue"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </>
            )}
            <div className="my-2 h-px bg-platinum-tint mx-4" />
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-3 p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="font-bold"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/auth/login");
                  }}
                >
                  Masuk
                </Button>
                <Button
                  size="sm"
                  className="font-bold"
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
                className="mx-2 font-bold"
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
