import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSocialIcon, buildWhatsAppHref } from "@/features/admin/company-profile/utils/companyProfileUtils";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";

export default function ContactSection() {
  const { profile } = usePublicCompanyProfile();

  const contactInfo = [
    {
      icon: <Phone size={18} />,
      label: "Telepon / WhatsApp",
      value: profile.whatsapp?.[0] || "-",
      sub: "Tersedia 24/7 untuk keadaan darurat",
      href: profile.whatsapp?.[0] ? buildWhatsAppHref(profile.whatsapp[0]) : undefined
    },
    {
      icon: <Mail size={18} />,
      label: "Email Resmi",
      value: profile.email || "-",
      sub: "Respon dalam 1-2 jam kerja",
      href: profile.email ? `mailto:${profile.email}` : undefined
    },
    {
      icon: <Clock size={18} />,
      label: "Jam Operasional",
      value: "08:00 - 21:00",
      sub: "Senin - Minggu (Termasuk Libur)",
    },
  ];

  return (
    <section id="contact-info" className="relative py-28 bg-white overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          
          <div className="flex flex-col gap-10">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-medium uppercase tracking-widest border border-slate-100 mb-6">
                <MessageSquare size={13} />
                Hubungi Kami
              </span>
              <h2 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl leading-tight mb-6">
                Punya Pertanyaan? <br />
                <span className="text-slate-400">Kami Siap Membantu.</span>
              </h2>
              <p className="text-base text-slate-400 leading-relaxed max-w-xl">
                Tim dukungan kami selalu siap memberikan solusi transportasi terbaik untuk kebutuhan perjalanan rombongan Anda.
              </p>
            </div>

            <div className="grid gap-4">
              {contactInfo.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`group flex items-start gap-5 p-5 rounded-xl bg-white border border-slate-100 transition-all duration-200 ${item.href ? 'hover:border-slate-200 hover:shadow-sm cursor-pointer' : ''}`}
                  onClick={() => item.href && window.open(item.href, '_blank')}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-200">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                    <p className="text-base font-medium text-slate-950 mb-0.5">{item.value}</p>
                    <p className="text-sm text-slate-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mr-1">Ikuti Kami:</p>
              {profile.social_media?.map((social, i) => (
                <a 
                  key={i}
                  href={social.url || "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors duration-200"
                  title={social.platform}
                >
                  <FontAwesomeIcon icon={getSocialIcon(social.platform)} />
                </a>
              ))}
              {(!profile.social_media || profile.social_media.length === 0) && (
                <p className="text-xs text-slate-400">Belum ada media sosial</p>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                {(profile as any).maps_link ? (
                   <iframe 
                    src={(profile as any).maps_link.replace('https://goo.gl/maps/', '').startsWith('https://www.google.com/maps/embed') ? (profile as any).maps_link : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1947413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnNDEuMSJTIDEwNsKwNDknMTAuNCJF!5e0!3m2!1sid!2sid!4v1634567890123!5m2!1sid!2sid"}
                    className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                    allowFullScreen={true} 
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <MapPin size={40} className="text-slate-200 mb-3" />
                    <p className="text-sm text-slate-300">Peta lokasi tidak tersedia</p>
                  </div>
                )}
              </div>

              <div className="p-8">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">Lokasi Kantor & Garasi</p>
                </div>
                <h4 className="text-lg font-medium text-slate-950 mb-2">{profile.company_name}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {profile.address || "Alamat belum diatur dalam profil perusahaan."}
                </p>
                {(profile as any).maps_link && (
                  <a 
                    href={(profile as any).maps_link || "#"} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors"
                  >
                    Buka di Google Maps
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
