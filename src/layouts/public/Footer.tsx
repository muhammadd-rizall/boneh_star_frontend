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
      className="bg-slate-900 text-slate-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 lg:py-24">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white text-slate-900 shadow-xl shadow-white/5">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={companyProfile.company_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BusFront size={24} />
                  )}
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">
                  {companyProfile.company_name}
                </span>
              </div>
              
              <p className="text-lg font-medium leading-relaxed text-slate-400 max-w-md">
                {companyProfile.description ||
                  "Solusi transportasi rombongan dengan standar layanan premium untuk setiap perjalanan berharga Anda."}
              </p>

              <div className="flex items-center gap-4">
                {socialMedias.map((social, idx) => {
                  const icon = getSocialIcon(social.platform);
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 transition-all hover:bg-orange-600 hover:text-white hover:border-orange-500"
                      aria-label={social.platform}
                    >
                      <FontAwesomeIcon icon={icon} className="text-lg group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-7 grid gap-12 sm:grid-cols-3">
              {/* Navigation */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Eksplorasi</h4>
                <ul className="flex flex-col gap-4">
                  {quickLinks.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="group inline-flex items-center text-sm font-bold text-slate-300 hover:text-white transition-colors"
                      >
                        {item.label}
                        <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Hubungi Kami</h4>
                <div className="flex flex-col gap-4 text-sm font-bold text-slate-300">
                  <div className="flex items-start gap-3 group">
                    <MapPin size={18} className="mt-0.5 text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="leading-relaxed group-hover:text-white transition-colors">{companyProfile.address}</span>
                  </div>
                  
                  {whatsappNumbers.map((whatsapp) => (
                    <a
                      key={whatsapp}
                      href={buildWhatsAppHref(whatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <FontAwesomeIcon icon={faWhatsapp} size="xs" />
                      </div>
                      <span className="group-hover:text-white transition-colors">{whatsapp}</span>
                    </a>
                  ))}

                  {companyProfile.email && (
                    <a
                      href={`mailto:${companyProfile.email}`}
                      className="flex items-center gap-3 group"
                    >
                      <Mail size={18} className="text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-white transition-colors">{companyProfile.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Portal Info */}
              <div className="flex flex-col gap-6">
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">Internal</h4>
                <Link
                  to="/admin/login"
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-5 transition-all hover:border-white/20"
                >
                  <div className="relative z-10 flex flex-col gap-2">
                    <span className="text-xs font-black text-white">Portal Admin</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Manajemen Sistem</span>
                  </div>
                  <div className="absolute top-4 right-4 text-slate-700 group-hover:text-orange-500 transition-colors">
                    <ArrowUpRight size={18} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              © {new Date().getFullYear()} {companyProfile.company_name}. Built for Excellence.
            </p>
            <div className="flex items-center gap-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
