import {
  Phone,
  Mail,
  Clock,
  MapPin,
  Headphones,
  ChevronRight
} from "lucide-react";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import {
  buildWhatsAppHref,
  normalizeWhatsApp,
} from "@/features/admin/company-profile/utils/companyProfileUtils";

// Local Custom SVG Icons for consistent and reliable brand rendering
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.45 5.489 0 9.953-4.437 9.956-9.897.002-2.644-1.019-5.13-2.875-6.99C16.49 1.86 14.009.839 11.37.839c-5.495 0-9.96 4.438-9.963 9.898-.001 2.03.529 4.018 1.537 5.722l-.99 3.61 3.703-.975zm11.233-5.321c-.3-.15-1.771-.875-2.046-.975-.276-.1-.477-.15-.677.15-.2.3-.777.975-.951 1.174-.176.2-.351.224-.652.074-.301-.15-1.27-.468-2.419-1.494-.893-.797-1.496-1.782-1.672-2.082-.176-.3-.019-.462.13-.611.135-.134.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.677-1.632-.927-2.232-.244-.587-.492-.507-.677-.517-.174-.01-.375-.012-.576-.012-.2 0-.527.075-.802.375-.276.3-1.053 1.03-1.053 2.512 0 1.482 1.078 2.912 1.228 3.112.15.2 2.122 3.24 5.14 4.545.717.31 1.277.495 1.711.633.722.23 1.379.197 1.9.12.58-.087 1.771-.725 2.022-1.425.25-.7.25-1.299.175-1.425-.076-.125-.276-.2-.577-.35z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YouTubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export default function ContactSection() {
  const { profile } = usePublicCompanyProfile();

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

  // Default Maps Embed URL pointing to Batusangkar
  const mapsEmbedUrl = (profile as { maps_link?: string }).maps_link && (profile as { maps_link?: string }).maps_link?.includes("embed")
    ? (profile as { maps_link: string }).maps_link
    : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.771221782283!2d100.5908051!3d-0.4578135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd52327cb707bb7%3A0xc3cf978c430ad8a7!2sKubu%20Rajo%2C%20Kec.%20Rambatan%2C%20Kabupaten%20Tanah%20Datar%2C%20Sumatera%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";

  const mapsRedirectUrl = (profile as { maps_link?: string }).maps_link && !(profile as { maps_link?: string }).maps_link?.includes("embed")
    ? (profile as { maps_link: string }).maps_link
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
                {/* WhatsApp */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                  title="WhatsApp"
                >
                  <WhatsAppIcon className="size-5 text-[#25D366]" />
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                  title="Instagram"
                >
                  <InstagramIcon className="size-5 text-[#E1306C]" />
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                  title="Facebook"
                >
                  <FacebookIcon className="size-5 text-[#1877F2]" />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                  title="YouTube"
                >
                  <YouTubeIcon className="size-5 text-[#FF0000]" />
                </a>
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
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white hover:bg-white/95 px-8 text-xs font-extrabold text-[#006bff] shadow-lg active:scale-95 transition-all w-full sm:w-auto cursor-pointer"
            >
              <WhatsAppIcon className="size-4 text-[#006bff]" />
              Chat via WhatsApp
              <ChevronRight size={14} strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
