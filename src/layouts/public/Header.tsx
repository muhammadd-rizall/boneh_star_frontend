import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import { BusFront, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";

const navigation = [
  { label: "Armada", href: "#armada" },
  { label: "Layanan", href: "#services" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "Kontak", href: "#contact" },
];

interface HeaderProps {
  companyProfile: Pick<CompanyProfile, "company_name" | "logo">;
}

export default function Header({ companyProfile }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const logoUrl = resolveMediaUrl(companyProfile.logo);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 ${
            isScrolled ? "bg-slate-900 text-white" : "bg-white text-slate-900"
          }`}>
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyProfile.company_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <BusFront size={20} />
            )}
          </div>
          <span className={`text-xl font-black tracking-tight transition-colors duration-300 ${
            isScrolled || !isHome ? "text-slate-900" : "text-white"
          }`}>
            {companyProfile.company_name}
          </span>
        </NavLink>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`text-sm font-bold transition-all hover:opacity-100 ${
                isScrolled || !isHome 
                  ? "text-slate-600 hover:text-slate-900" 
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <NavLink
            to="/admin/login"
            className={`px-4 py-2 text-sm font-bold transition-colors ${
              isScrolled || !isHome ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"
            }`}
          >
            Portal Admin
          </NavLink>
          <a
            href="#contact"
            className="inline-flex h-11 items-center rounded-xl bg-orange-600 px-6 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-500 active:scale-95"
          >
            Pesan Sekarang
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-all md:hidden ${
            isScrolled || !isHome 
              ? "border-slate-200 bg-white text-slate-700" 
              : "border-white/20 bg-white/10 text-white backdrop-blur-md"
          }`}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="absolute inset-x-0 top-full border-t border-slate-100 bg-white p-4 shadow-xl md:hidden animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
            <hr className="my-2 border-slate-100" />
            <NavLink
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Masuk Portal Admin
            </NavLink>
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center rounded-xl bg-orange-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-orange-600/15"
            >
              Pesan Sekarang
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
