import type { CompanyProfile } from "@/features/admin/company-profile/types/CompanyProfile";
import {
  BusFront,
  Mail,
  MapPin,
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
  { label: "Layanan", href: "#services" },
  { label: "Keunggulan", href: "#features" },
  { label: "Kontak", href: "#contact" },
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
      className="relative overflow-hidden border-t border-slate-200 bg-slate-950 text-slate-200"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white text-slate-900">
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
              <p className="text-lg font-bold tracking-tight text-white">
                {companyProfile.company_name}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Transport Service
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
            {companyProfile.description ||
              "Kami membantu pemesanan armada menjadi lebih cepat, rapi, dan profesional, dari permintaan penawaran sampai konfirmasi keberangkatan."}
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socialMedias.map((social, idx) => {
              const icon = getSocialIcon(social.platform);
              return (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
                  aria-label={social.platform}
                >
                  <FontAwesomeIcon icon={icon} className="text-lg" />
                </a>
              );
            })}

            {!socialMedias.length && companyProfile.email && (
              <a
                href={`mailto:${companyProfile.email}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Navigasi
          </p>
          <div className="mt-5 flex flex-col gap-3 text-sm">
            {quickLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-slate-300 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/admin/login"
              className="text-slate-300 transition hover:text-white"
            >
              Portal Admin
            </Link>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Hubungi Kami
          </p>
          <div className="mt-5 space-y-4 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 text-cyan-300" />
              <span>{companyProfile.address}</span>
            </div>
            {whatsappNumbers.map((whatsapp) => (
              <a
                key={whatsapp}
                href={buildWhatsAppHref(whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-cyan-300" />
                <span>{whatsapp} (WA)</span>
              </a>
            ))}
            {companyProfile.email && (
              <a
                href={`mailto:${companyProfile.email}`}
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Mail size={16} className="text-cyan-300" />
                <span>{companyProfile.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="flex border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} {companyProfile.company_name}. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
