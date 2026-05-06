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
        <div className="py-24 lg:py-32">
          <div className="grid gap-20 lg:grid-cols-12">
            {/* Brand Section */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <div className="flex items-center gap-4 group">
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-[1.25rem] bg-white text-slate-950 shadow-2xl transition-all duration-500 group-hover:rotate-6">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={companyProfile.company_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BusFront size={28} />
                  )}
                </div>
                <span className="text-3xl font-black tracking-tighter text-white">
                  {companyProfile.company_name}
                </span>
              </div>
              
              <p className="text-xl font-medium leading-relaxed text-slate-400 max-w-md">
                {companyProfile.description ||
                  "Memberikan standar baru dalam perjalanan rombongan dengan kenyamanan maksimal dan keamanan terjamin."}
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
                      className="group flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400 transition-all duration-500 hover:bg-orange-600 hover:text-white hover:border-orange-500 hover:-translate-y-1"
                      aria-label={social.platform}
                    >
                      <FontAwesomeIcon icon={icon} className="text-lg transition-transform group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Grid */}
            <div className="lg:col-span-7 grid gap-16 sm:grid-cols-3">
              {/* Navigation */}
              <div className="flex flex-col gap-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Navigasi</h4>
                <ul className="flex flex-col gap-5">
                  {quickLinks.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="group inline-flex items-center text-sm font-bold text-slate-400 hover:text-white transition-all duration-300"
                      >
                        <span className="mr-0 group-hover:mr-2 transition-all duration-300 group-hover:text-orange-500">—</span>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Hubungi Kami</h4>
                <div className="flex flex-col gap-6 text-sm font-bold text-slate-400">
                  <div className="flex items-start gap-4 group">
                    <MapPin size={20} className="mt-0.5 text-slate-600 shrink-0 group-hover:text-orange-500 transition-all duration-300" />
                    <span className="leading-relaxed group-hover:text-white transition-colors">{companyProfile.address}</span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {whatsappNumbers.map((whatsapp) => (
                      <a
                        key={whatsapp}
                        href={buildWhatsAppHref(whatsapp)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 group"
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                          <FontAwesomeIcon icon={faWhatsapp} size="xs" />
                        </div>
                        <span className="group-hover:text-white transition-colors">{whatsapp}</span>
                      </a>
                    ))}
                  </div>

                  {companyProfile.email && (
                    <a
                      href={`mailto:${companyProfile.email}`}
                      className="flex items-center gap-4 group"
                    >
                      <Mail size={20} className="text-slate-600 shrink-0 group-hover:text-orange-500 transition-all duration-300" />
                      <span className="group-hover:text-white transition-colors">{companyProfile.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Portal Info */}
              <div className="flex flex-col gap-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">Internal Access</h4>
                <Link
                  to="/admin/login"
                  className="group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 p-6 transition-all duration-500 hover:border-orange-500/50 hover:bg-white/[0.07]"
                >
                  <div className="relative z-10 flex flex-col gap-2">
                    <span className="text-xs font-black text-white group-hover:text-orange-500 transition-colors">Portal Admin</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Management System</span>
                  </div>
                  <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 text-orange-500 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <ArrowUpRight size={20} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
              © {new Date().getFullYear()} {companyProfile.company_name}. Crafted for Excellence.
            </p>
            <div className="flex items-center gap-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-orange-500 cursor-pointer transition-all duration-300">Privacy Policy</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-orange-500 cursor-pointer transition-all duration-300">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
