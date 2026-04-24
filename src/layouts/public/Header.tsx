import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import { BusFront, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";

const navigation = [
  { label: "Layanan", href: "#services" },
  { label: "Keunggulan", href: "#features" },
  { label: "Kontak", href: "#contact" },
];

interface HeaderProps {
  companyProfile: Pick<CompanyProfile, "company_name" | "logo">;
}

export default function Header({ companyProfile }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const logoUrl = resolveMediaUrl(companyProfile.logo);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
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
          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">
              {companyProfile.company_name}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Transport Service
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-sm md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <NavLink
            to="/admin/login"
            className="inline-flex h-10 items-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
          >
            Portal Admin
          </NavLink>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95 md:hidden"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white/95 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
            <NavLink
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-slate-900/15"
            >
              Masuk Portal Admin
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
