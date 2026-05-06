import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import WhatsAppFloating from "./WhatsAppFloating";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { profile } = usePublicCompanyProfile();

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-100 selection:text-orange-900">
      {/* Subtle background pattern or soft glow */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_10%,rgba(249,115,22,0.03),transparent)]" />
      
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header companyProfile={profile} />
        <main className="flex-1">{children}</main>
        <Footer companyProfile={profile} />
        <WhatsAppFloating whatsapp={profile.whatsapp} />
      </div>
    </div>
  );
}
