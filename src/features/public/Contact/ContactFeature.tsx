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
      icon: <Phone size={20} />,
      label: "Telepon / WhatsApp",
      value: profile.whatsapp?.[0] || "-",
      sub: "Tersedia 24/7 untuk keadaan darurat",
      href: profile.whatsapp?.[0] ? buildWhatsAppHref(profile.whatsapp[0]) : undefined
    },
    {
      icon: <Mail size={20} />,
      label: "Email Resmi",
      value: profile.email || "-",
      sub: "Respon dalam 1-2 jam kerja",
      href: profile.email ? `mailto:${profile.email}` : undefined
    },
    {
      icon: <Clock size={20} />,
      label: "Jam Operasional",
      value: "08:00 - 21:00",
      sub: "Senin - Minggu (Termasuk Libur)",
    },
  ];

  return (
    <section id="contact-info" className="relative py-32 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-orange-50 rounded-full blur-[120px] opacity-50" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-20 lg:grid-cols-2 lg:items-start">
          
          <div className="flex flex-col gap-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 mb-6">
                <MessageSquare size={14} className="text-orange-500" />
                Hubungi Kami
              </span>
              <h2 className="text-5xl font-black tracking-tighter text-slate-950 md:text-6xl leading-[0.95] mb-8">
                Punya Pertanyaan? <br />
                <span className="text-orange-500 italic">Kami Siap Membantu.</span>
              </h2>
              <p className="text-lg font-medium text-slate-500 leading-relaxed max-w-xl">
                Tim dukungan kami selalu siap memberikan solusi transportasi terbaik untuk kebutuhan perjalanan rombongan Anda.
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfo.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`group flex items-start gap-6 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm transition-all duration-300 ${item.href ? 'hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer' : ''}`}
                  onClick={() => item.href && window.open(item.href, '_blank')}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-slate-950 mb-1">{item.value}</p>
                    <p className="text-sm font-medium text-slate-400">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mr-2">Ikuti Kami:</p>
              {profile.social_media?.map((social, i) => (
                <a 
                  key={i}
                  href={social.url || "#"} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-orange-500 hover:text-white transition-all shadow-sm"
                  title={social.platform}
                >
                  <FontAwesomeIcon icon={getSocialIcon(social.platform)} />
                </a>
              ))}
              {(!profile.social_media || profile.social_media.length === 0) && (
                <p className="text-xs font-medium text-slate-400 italic">Belum ada media sosial</p>
              )}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-500/5 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/60 overflow-hidden">
              <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
                {(profile as any).maps_link ? (
                   <iframe 
                    src={(profile as any).maps_link.replace('https://goo.gl/maps/', '').startsWith('https://www.google.com/maps/embed') ? (profile as any).maps_link : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1947413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnNDEuMSJTIDEwNsKwNDknMTAuNCJF!5e0!3m2!1sid!2sid!4v1634567890123!5m2!1sid!2sid"}
                    className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                    allowFullScreen={true} 
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <MapPin size={48} className="text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-300 italic">Peta lokasi tidak tersedia</p>
                  </div>
                )}
              </div>

              <div className="p-10 bg-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <p className="text-xs font-black uppercase tracking-widest text-orange-600">Lokasi Kantor & Garasi</p>
                </div>
                <h4 className="text-xl font-bold text-slate-950 mb-3">{profile.company_name}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  {profile.address || "Alamat belum diatur dalam profil perusahaan."}
                </p>
                {(profile as any).maps_link && (
                  <a 
                    href={(profile as any).maps_link || "#"} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-black text-slate-950 hover:text-orange-600 transition-colors"
                  >
                    Buka di Google Maps
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
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
