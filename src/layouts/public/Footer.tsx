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
      className="bg-slate-950 text-slate-300"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-16 lg:py-20">
          <div className="grid gap-14 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col gap-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white text-slate-950">
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
                <span className="text-xl font-semibold tracking-tight text-white">
                  {companyProfile.company_name}
                </span>
              </div>
              
              <p className="text-sm leading-relaxed text-slate-400 max-w-md">
                {companyProfile.description ||
                  "Memberikan standar baru dalam perjalanan rombongan dengan kenyamanan maksimal dan keamanan terjamin."}
              </p>

              <div className="flex items-center gap-2.5">
                {socialMedias.map((social, idx) => {
                  const icon = getSocialIcon(social.platform);
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-500 transition-colors duration-200 hover:bg-white/10 hover:text-white"
                      aria-label={social.platform}
                    >
                      <FontAwesomeIcon icon={icon} className="text-sm" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-7 grid gap-12 sm:grid-cols-3">
              {/* Navigation */}
              <div className="flex flex-col gap-5">
                <h4 className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Navigasi</h4>
                <ul className="flex flex-col gap-3.5">
                  {quickLinks.map((item) => {
                    const isHash = item.href.startsWith("#");
                    const toPath = isHash ? `/${item.href}` : item.href;

                    return (
                      <li key={item.label}>
                        <Link
                          to={toPath}
                          className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-5">
                <h4 className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Hubungi Kami</h4>
                <div className="flex flex-col gap-4 text-sm text-slate-400">
                  <div className="flex items-start gap-3">
                    <MapPin size={15} className="mt-0.5 text-slate-600 shrink-0" />
                    <span className="leading-relaxed">{companyProfile.address}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2.5">
                    {whatsappNumbers.map((whatsapp) => (
                      <a
                        key={whatsapp}
                        href={buildWhatsAppHref(whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 hover:text-white transition-colors duration-200"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded text-emerald-500">
                          <FontAwesomeIcon icon={faWhatsapp} size="sm" />
                        </div>
                        <span>{whatsapp}</span>
                      </a>
                    ))}
                  </div>

                  {companyProfile.email && (
                    <a
                      href={`mailto:${companyProfile.email}`}
                      className="flex items-center gap-3 hover:text-white transition-colors duration-200"
                    >
                      <Mail size={15} className="text-slate-600 shrink-0" />
                      <span>{companyProfile.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Portal Info */}
              <div className="flex flex-col gap-5">
                <h4 className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Internal Access</h4>
                <Link
                  to="/admin/login"
                  className="group rounded-xl bg-white/5 border border-white/5 p-5 transition-colors duration-200 hover:bg-white/[0.08] hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-white">Portal Admin</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">Management System</span>
                    </div>
                    <ArrowUpRight size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              © {new Date().getFullYear()} {companyProfile.company_name}. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
