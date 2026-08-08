import { Link } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import {
  buildWhatsAppHref,
  normalizeWhatsApp,
} from "@/features/admin/company-profile/utils/companyProfileUtils";
import { useCustomerAuthStore } from "@/features/auth/public";

export default function CTABanner() {
  const { profile } = usePublicCompanyProfile();
  const { isAuthenticated } = useCustomerAuthStore();

  const whatsappNumbers = normalizeWhatsApp(profile?.whatsapp);
  const primaryWhatsApp = whatsappNumbers[0];
  const whatsappHref = primaryWhatsApp
    ? buildWhatsAppHref(primaryWhatsApp, "Halo Admin Boneh Star, saya ingin tanya informasi sewa bus pariwisata.")
    : "https://wa.me/6281234567890?text=Halo%20Admin%20Boneh%20Star,%20saya%20ingin%20tanya%20informasi%20sewa%20bus%20pariwisata.";

  const bookingLink = isAuthenticated ? "/customer/bookings/request" : "/auth/login";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#0038a8] to-[#006bff] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_12px_40px_rgba(0,107,255,0.15)]">
        {/* Left Section: Icon and Content */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full lg:w-auto">
          {/* Icon Circle */}
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/15 shadow-inner">
            <Calendar size={26} className="text-white" strokeWidth={1.8} />
          </div>
          
          {/* Text Content */}
          <div className="space-y-1.5">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Siap Berangkat Bersama {profile.company_name || "Boneh Star"}?
            </h3>
            <p className="text-sm md:text-base font-medium text-white/80 max-w-2xl leading-relaxed">
              Reservasi sekarang dan dapatkan pengalaman perjalanan yang berkesan!
            </p>
          </div>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0 justify-center">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center rounded-[12px] border border-white/30 bg-transparent px-8 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/50 active:scale-95"
          >
            Hubungi Kami
          </a>
          <Link
            to={bookingLink}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[12px] bg-white px-8 text-sm font-bold text-[#006bff] transition-all hover:bg-white/95 hover:shadow-lg active:scale-95"
          >
            Buat Reservasi
            <ArrowRight size={16} strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
