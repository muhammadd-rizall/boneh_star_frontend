import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import { 
  BusFront, 
  Menu, 
  X, 
  Music2, 
  Globe, 
  AtSign,
  Share2,
  MessageCircle
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  normalizeSocialMedia,
  resolveMediaUrl,
} from "@/features/admin/company-profile/utils/companyProfileUtils";

const navigation = [
  { label: "Layanan", href: "#services" },
  { label: "Keunggulan", href: "#features" },
  { label: "Kontak", href: "#contact" },
];

interface HeaderProps {
  companyProfile: Pick<
    CompanyProfile,
    "company_name" | "social_media" | "logo"
  >;
}

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return Share2;
  if (p.includes("facebook")) return Share2;
  if (p.includes("twitter") || p.includes("x.com")) return Share2;
  if (p.includes("youtube")) return Share2;
  if (p.includes("tiktok")) return Music2;
  if (p.includes("threads")) return AtSign;
  if (p.includes("whatsapp")) return MessageCircle;
  return Globe;
};

export default function Header({ companyProfile }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const socialMedia = normalizeSocialMedia(companyProfile.social_media);
  const logoUrl = resolveMediaUrl(companyProfile.logo);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3">
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
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center justify-center gap-2 md:flex">
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 p-1.5 shadow-sm">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Action Buttons & Social Icons */}
        <div className="hidden items-center justify-end gap-3 md:flex">
          <div className="flex items-center gap-1">
            {socialMedia.map((social, index) => {
              const Icon = getSocialIcon(social.platform);
              return (
                <a
                  key={`social-${index}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-indigo-600"
                  title={social.platform}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
          
          <div className="h-4 w-px bg-slate-200" />
          
          <NavLink
            to="/admin/login"
            className="inline-flex h-10 items-center rounded-full bg-slate-900 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 active:scale-95"
          >
            Portal Admin
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center justify-end md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="border-t border-slate-200 bg-white p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:bg-slate-100"
              >
                {item.label}
              </a>
            ))}
            
            <div className="my-2 h-px bg-slate-100" />
            
            <div className="grid grid-cols-2 gap-2">
              {socialMedia.map((social, index) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <a
                    key={`social-mob-${index}`}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-600 transition active:bg-slate-100"
                  >
                    <Icon size={18} className="text-slate-400" />
                    <span className="truncate">{social.platform}</span>
                  </a>
                );
              })}
            </div>
t 
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
