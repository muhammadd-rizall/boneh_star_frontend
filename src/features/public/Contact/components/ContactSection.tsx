import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Headphones,
  ChevronRight,
  Globe,
} from "lucide-react";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import {
  buildWhatsAppHref,
  normalizeWhatsApp,
  normalizeSocialMedia,
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


export default function ContactSection() {
  const { profile } = usePublicCompanyProfile();
  const socialMedias = normalizeSocialMedia(profile?.social_media);

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

  const companyNameVal = profile?.company_name || "Boneh Star Pariwisata";
  const addressVal = profile?.address || "Jalan Lintau No. 12, Kubu Rajo, Batusangkar\nKabupaten Tanah Datar, Sumatera Barat 27213";
  const emailVal = profile?.email || "bonehstar.pariwisata@gmail.com";
  
  // Normalize & retrieve all WhatsApp numbers
  const whatsappNumbers = normalizeWhatsApp(profile?.whatsapp);
  
  // Format WhatsApp list for display
  const rawWhatsAppList = Array.isArray(profile?.whatsapp) && profile.whatsapp.length > 0
    ? profile.whatsapp
    : ["0822 6846 0878", "0812 6543 2109"]; // Fallback showing 2 numbers

  const normalizedWhatsAppList = whatsappNumbers.length > 0
    ? whatsappNumbers
    : ["6282268460878", "6281265432109"];

  const primaryWhatsApp = normalizedWhatsAppList[0];
  const whatsappHref = `${buildWhatsAppHref(primaryWhatsApp)}?text=Halo%20Admin%20Boneh%20Star,%20saya%20ingin%20tanya%20informasi%20layanan`;

  const contactInfo = [
    {
      icon: <Phone size={18} strokeWidth={2.2} />,
      label: "Telepon / WhatsApp",
      values: rawWhatsAppList.map((num, i) => ({
        text: String(num),
        href: `${buildWhatsAppHref(normalizedWhatsAppList[i] || normalizedWhatsAppList[0])}?text=Halo%20Admin%20Boneh%20Star,%20saya%20ingin%20tanya%20informasi%20layanan`
      })),
      sub: "Tersedia 24/7 untuk keadaan darurat",
    },
    {
      icon: <Mail size={18} strokeWidth={2.2} />,
      label: "Email Resmi",
      value: emailVal,
      sub: "Respon dalam 1-2 jam kerja",
      href: `mailto:${emailVal}`,
    },
    {
      icon: <Clock size={18} strokeWidth={2.2} />,
      label: "Jam Operasional",
      value: "08:00 - 21:00",
      sub: "Senin - Minggu (Termasuk Libur)",
    },
  ];

  const mapsEmbedUrl = (profile as unknown as Record<string, any>)?.maps_link && (profile as unknown as Record<string, any>)?.maps_link?.includes("embed")
    ? (profile as unknown as Record<string, any>).maps_link
    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.771221782283!2d100.5908051!3d-0.4578135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd52327cb707bb7%3A0xc3cf978c430ad8a7!2sKubu%20Rajo%2C%20Kec.%20Rambatan%2C%20Kabupaten%20Tanah%20Datar%2C%20Sumatera%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";

  const mapsRedirectUrl = (profile as unknown as Record<string, any>)?.maps_link && !(profile as unknown as Record<string, any>)?.maps_link?.includes("embed")
    ? (profile as unknown as Record<string, any>).maps_link
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(companyNameVal + " " + addressVal.replace(/\n/g, " "))}`;

  return (
    <section id="contact-info" className="relative py-16 bg-white overflow-hidden text-left">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Section - Spans full width on desktop to prevent map card from being pushed too high */}
        <div className="mb-12 max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#006bff] mb-3 block">
            HUBUNGI KAMI
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Punya Pertanyaan? <br />
            Kami <span className="text-[#006bff]">Siap Membantu!</span>
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-500 leading-relaxed max-w-xl">
            Tim kami selalu siap memberikan solusi transportasi terbaik untuk kebutuhan perjalanan rombongan Anda. Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left Column: Cards & Socials */}
          <div className="flex flex-col gap-8">
            {/* Contact Cards */}
            <div className="grid gap-4">
              {contactInfo.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => !item.values && item.href && window.open(item.href, "_blank")}
                  className={`flex items-start gap-5 p-6 rounded-2xl border border-slate-100 bg-white transition-all duration-300 ${
                    !item.values && item.href
                      ? "hover:border-[#006bff]/20 hover:shadow-[0_8px_30px_rgba(0,107,255,0.04)] cursor-pointer"
                      : ""
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#006bff] border border-blue-100/50">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                      {item.label}
                    </p>
                    
                    {/* Dynamic WhatsApp list support */}
                    {item.values ? (
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
                        {item.values.map((val, vIdx) => (
                          <span key={vIdx} className="flex items-center">
                            <a
                              href={val.href}
                              target="_blank"
                              rel="noreferrer"
                              className="text-base font-extrabold text-slate-800 hover:text-[#006bff] transition-colors"
                            >
                              {val.text}
                            </a>
                            {vIdx < item.values.length - 1 && (
                              <span className="text-slate-300 ml-2 font-semibold select-none">/</span>
                            )}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-base font-extrabold text-slate-800 mb-0.5">
                        {item.value}
                      </p>
                    )}
                    
                    <p className="text-xs font-medium text-slate-400">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Ikuti Kami di
              </span>
              <div className="flex items-center gap-3">
                {/* WhatsApp (Always available as primary contact) */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-105 hover:bg-emerald-50 hover:border-emerald-200 transition-all duration-300"
                  title="WhatsApp"
                >
                  <Whatsapp className="size-5" />
                </a>

                {/* Dynamic Social Medias from Company Profile */}
                {socialMedias.map((social, idx) => {
                  const { icon: Icon, className: iconClass, hoverBg } = localGetSocialIcon(social.platform);
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 ${hoverBg}`}
                      title={social.platform}
                    >
                      <Icon className={`size-5 ${iconClass}`} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Maps Card */}
          <div className="bg-white rounded-[28px] border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="h-[400px] w-full bg-slate-50 relative overflow-hidden">
              <iframe
                src={mapsEmbedUrl}
                className="absolute inset-0 w-full h-full border-0 transition-all duration-500"
                allowFullScreen
                loading="lazy"
                title="Lokasi Kantor"
              />
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2.5 mb-3">
                <MapPin size={16} className="text-[#006bff]" />
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-[#006bff]">
                  LOKASI KANTOR & GARASI
                </p>
              </div>
              <h4 className="text-xl font-extrabold text-slate-900 mb-2">
                {companyNameVal}
              </h4>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 whitespace-pre-line">
                {addressVal}
              </p>
              <a
                href={mapsRedirectUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 hover:border-[#006bff]/20 bg-white hover:bg-slate-50 px-6 text-xs font-bold text-slate-600 hover:text-[#006bff] transition-all cursor-pointer"
              >
                Lihat di Google Maps
                <ChevronRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0a3068] to-[#0c408a] p-8 md:p-10 shadow-[0_12px_40px_rgba(10,48,104,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
          
          <div className="flex flex-col md:flex-row items-center gap-6 z-10 w-full md:w-auto">
            {/* Headphone Circle Icon */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white border border-white/20 shadow-inner">
              <Headphones size={26} strokeWidth={1.8} />
            </div>
            
            {/* Text Content */}
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                Butuh Bantuan Segera?
              </h4>
              <p className="text-xs md:text-sm font-medium text-white/80 max-w-xl leading-relaxed">
                Hubungi kami sekarang juga untuk mendapatkan penawaran terbaik dan konsultasi gratis seputar perjalanan Anda.
              </p>
            </div>
          </div>

          {/* CTA Button (No Bus Image) */}
          <div className="flex items-center z-10 w-full md:w-auto shrink-0 justify-center md:justify-end">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/95 px-8 text-xs font-extrabold text-[#128C7E] shadow-lg active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
            >
              <Whatsapp className="size-4" />
              Chat via WhatsApp
              <ChevronRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
