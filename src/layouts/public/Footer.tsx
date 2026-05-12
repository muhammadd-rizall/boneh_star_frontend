import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import {
  BusFront,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import {
  buildWhatsAppHref,
  normalizeWhatsApp,
  normalizeSocialMedia,
  resolveMediaUrl,
  getSocialIcon,
} from "@/features/admin/company-profile/utils/companyProfileUtils";

const quickLinks = [
  { label: "Armada Kami", href: "#armada" },
  { label: "Layanan", href: "#services" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "Fitur", href: "#features" },
];

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

  return (
    <footer
      id="contact"
      className="bg-slate-950 text-slate-200 selection:bg-orange-500 selection:text-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid gap-14 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex items-center gap-3 group">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white text-slate-950 shadow-lg transition-all duration-500 group-hover:rotate-3">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={companyProfile.company_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BusFront size={22} />
                  )}
                </div>
                <span className="text-2xl font-bold tracking-tight text-white">
                  {companyProfile.company_name}
                </span>
              </div>
              
              <p className="text-base font-medium leading-relaxed text-slate-400 max-w-md">
                {companyProfile.description ||
                  "Memberikan standar baru dalam perjalanan rombongan dengan kenyamanan maksimal dan keamanan terjamin."}
              </p>

              <div className="flex items-center gap-3">
                {socialMedias.map((social, idx) => {
                  const icon = getSocialIcon(social.platform);
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-400 transition-all duration-300 hover:bg-orange-600 hover:text-white hover:border-orange-500 hover:-translate-y-0.5"
                      aria-label={social.platform}
                    >
                      <FontAwesomeIcon icon={icon} className="text-sm transition-transform group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-7 grid gap-12 sm:grid-cols-3">
              {/* Navigation */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500">Navigasi</h4>
                <ul className="flex flex-col gap-4">
                  {quickLinks.map((item) => {
                    const isHash = item.href.startsWith("#");
                    const toPath = isHash ? `/${item.href}` : item.href;

                    return (
                      <li key={item.label}>
                        <Link
                          to={toPath}
                          className="group inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-300"
                        >
                          <span className="mr-0 opacity-0 group-hover:mr-2 group-hover:opacity-100 transition-all duration-300 text-orange-500">→</span>
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500">Hubungi Kami</h4>
                <div className="flex flex-col gap-5 text-sm font-medium text-slate-400">
                  <div className="flex items-start gap-3 group">
                    <MapPin size={16} className="mt-0.5 text-slate-600 shrink-0 group-hover:text-orange-500 transition-colors" />
                    <span className="leading-relaxed group-hover:text-white transition-colors">{companyProfile.address}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2.5">
                    {whatsappNumbers.map((whatsapp) => (
                      <a
                        key={whatsapp}
                        href={buildWhatsAppHref(whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 group"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                          <FontAwesomeIcon icon={faWhatsapp} size="xs" />
                        </div>
                        <span className="group-hover:text-white transition-colors">{whatsapp}</span>
                      </a>
                    ))}
                  </div>

                  {companyProfile.email && (
                    <a
                      href={`mailto:${companyProfile.email}`}
                      className="flex items-center gap-3 group"
                    >
                      <Mail size={16} className="text-slate-600 shrink-0 group-hover:text-orange-500 transition-colors" />
                      <span className="group-hover:text-white transition-colors">{companyProfile.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Portal Info */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500">Internal Access</h4>
                <Link
                  to="/admin/login"
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 transition-all duration-400 hover:border-orange-500/50 hover:bg-white/[0.07]"
                >
                  <div className="relative z-10 flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-white group-hover:text-orange-500 transition-colors">Portal Admin</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Management System</span>
                  </div>
                  <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 text-orange-500 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-semibold text-slate-600">
              © {new Date().getFullYear()} {companyProfile.company_name}. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <span className="text-xs font-semibold text-slate-600 hover:text-orange-500 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-xs font-semibold text-slate-600 hover:text-orange-500 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
