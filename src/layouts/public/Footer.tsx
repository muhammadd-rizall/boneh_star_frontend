import { useState, useEffect } from "react";
import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import {
  BusFront,
  Mail,
  MapPin,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  buildWhatsAppHref,
  normalizeWhatsApp,
  normalizeSocialMedia,
  resolveMediaUrl,
} from "@/features/admin/company-profile/utils/companyProfileUtils";
import {
  Youtube,
  Instagram,
  Facebook,
  Tiktok,
  Threads,
  X,
  Whatsapp,
  Linkedin,
} from "@thesvg/react";
import { publicService } from "@/features/public/shared/services/publicService";

interface FooterProps {
  companyProfile: Pick<
    CompanyProfile,
    "company_name" | "address" | "whatsapp" | "social_media" | "email" | "description" | "logo"
  >;
}

export default function Footer({ companyProfile }: FooterProps) {
  const whatsappNumbers = normalizeWhatsApp(companyProfile.whatsapp);
  const socialMedias = normalizeSocialMedia(companyProfile.social_media);
  const logoUrl = resolveMediaUrl(companyProfile.logo);

  const localGetSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("instagram")) {
      return {
        icon: Instagram,
        className: "instagram-icon",
        hoverBg: "hover:bg-pink-50 hover:border-pink-200",
      };
    }
    if (p.includes("facebook")) {
      return {
        icon: Facebook,
        className: "facebook-icon",
        hoverBg: "hover:bg-blue-50 hover:border-blue-200",
      };
    }
    if (p.includes("twitter") || p.includes("x.com")) {
      return {
        icon: X,
        className: "x-icon",
        hoverBg: "hover:bg-slate-100 hover:border-slate-300",
      };
    }
    if (p.includes("youtube")) {
      return {
        icon: Youtube,
        className: "youtube-icon",
        hoverBg: "hover:bg-red-50 hover:border-red-200",
      };
    }
    if (p.includes("tiktok")) {
      return {
        icon: Tiktok,
        className: "tiktok-icon",
        hoverBg: "hover:bg-slate-100 hover:border-slate-300",
      };
    }
    if (p.includes("threads")) {
      return {
        icon: Threads,
        className: "threads-icon",
        hoverBg: "hover:bg-slate-100 hover:border-slate-300",
      };
    }
    if (p.includes("linkedin")) {
      return {
        icon: Linkedin,
        className: "linkedin-icon",
        hoverBg: "hover:bg-blue-50 hover:border-blue-200",
      };
    }
    if (p.includes("whatsapp") || p.includes("wa.me")) {
      return {
        icon: Whatsapp,
        className: "whatsapp-icon",
        hoverBg: "hover:bg-emerald-50 hover:border-emerald-200",
      };
    }
    return {
      icon: Globe,
      className: "text-slate-400",
      hoverBg: "hover:bg-slate-50 hover:border-slate-300",
    };
  };

  const footerMenu = [
    { label: "Home", href: "/" },
    { label: "Armada", href: "/armada" },
    { label: "Tentang Kami", href: "/tentang-kami" },
    { label: "Kontak", href: "/contact" },
  ];

  const [servicesMenu, setServicesMenu] = useState([
    { label: "Wisata", href: "/armada" },
    { label: "Studi Tour", href: "/armada" },
    { label: "Family Gathering", href: "/armada" },
    { label: "Ziarah & Religi", href: "/armada" },
    { label: "Acara Pernikahan", href: "/armada" },
  ]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const activityTypes = await publicService.getActivityTypes();
        const activeTypes = activityTypes.filter(a => !a.deleted_at);
        if (activeTypes.length > 0) {
          setServicesMenu(activeTypes.slice(0, 5).map(item => ({
            label: item.name,
            href: "/armada"
          })));
        }
      } catch (err) {
        console.error("Gagal memuat layanan untuk footer:", err);
      }
    };
    fetchServices();
  }, []);

  return (
    <footer
      id="contact"
      className="bg-slate-50/80 border-t border-slate-150/60 text-slate-500"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid gap-10 md:grid-cols-12">
            {/* Brand Section */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={companyProfile.company_name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <BusFront size={24} className="text-[#006bff]" />
                  )}
                </div>
                <span className="text-xl font-bold tracking-tight text-midnight-indigo uppercase">
                  {companyProfile.company_name}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
                Menyediakan layanan transportasi pariwisata terbaik dengan armada nyaman, aman, dan terawat untuk setiap perjalanan Anda.
              </p>

              {/* Social Media Circular Buttons */}
              <div className="flex items-center gap-2.5">
                {socialMedias.map((social, idx) => {
                  const { icon: Icon, className: iconClass, hoverBg } = localGetSocialIcon(social.platform);
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex h-9 w-9 items-center justify-center rounded-full bg-white border border-slate-200 transition-all duration-200 ${hoverBg} hover:scale-105 active:scale-95 shadow-sm`}
                      aria-label={social.platform}
                    >
                      <Icon className={`size-[18px] ${iconClass}`} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-8 grid gap-8 grid-cols-2 sm:grid-cols-4">
              {/* Menu */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-midnight-indigo uppercase tracking-wider">Menu</h4>
                <ul className="flex flex-col gap-3">
                  {footerMenu.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-sm text-slate-500 hover:text-[#006bff] transition-colors duration-200 font-medium"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Layanan */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-midnight-indigo uppercase tracking-wider">Layanan</h4>
                <ul className="flex flex-col gap-3">
                  {servicesMenu.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-sm text-slate-500 hover:text-[#006bff] transition-colors duration-200 font-medium"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kontak Kami */}
              <div className="flex flex-col gap-6 sm:col-span-1">
                <h4 className="text-xs font-extrabold text-midnight-indigo uppercase tracking-wider">Kontak Kami</h4>
                <div className="flex flex-col gap-3.5 text-sm text-slate-500">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
                    <span className="leading-relaxed font-medium">{companyProfile.address}</span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {whatsappNumbers.map((whatsapp, idx) => (
                      <a
                        key={idx}
                        href={buildWhatsAppHref(whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2.5 hover:text-[#006bff] transition-colors duration-200 font-medium"
                      >
                        <Whatsapp className="size-4 fill-emerald-500" />
                        <span>{whatsapp}</span>
                      </a>
                    ))}
                  </div>

                  {companyProfile.email && (
                    <a
                      href={`mailto:${companyProfile.email}`}
                      className="flex items-center gap-2.5 hover:text-[#006bff] transition-colors duration-200 font-medium"
                    >
                      <Mail size={16} className="text-slate-400 shrink-0" />
                      <span className="truncate">{companyProfile.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Jam Operasional */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-extrabold text-midnight-indigo uppercase tracking-wider">Jam Operasional</h4>
                <div className="bg-white border border-slate-150/85 rounded-2xl p-4 flex flex-col gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                  <p className="text-xs font-bold text-slate-400">Senin - Minggu</p>
                  <p className="text-sm text-[#006bff] font-bold">08.00 - 22.00 WIB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-slate-150/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} {companyProfile.company_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-slate-400 hover:text-[#006bff] cursor-pointer transition-colors font-medium">Privacy Policy</span>
            <span className="text-xs text-slate-400 hover:text-[#006bff] cursor-pointer transition-colors font-medium">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
