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
    <div className="min-h-screen bg-white text-midnight-indigo selection:bg-action-blue/20 selection:text-midnight-indigo">
      <div className="relative flex min-h-screen flex-col">
        <Header companyProfile={profile} />
        <main className="flex-1">{children}</main>
        <Footer companyProfile={profile} />
        <WhatsAppFloating whatsapp={profile.whatsapp} />
      </div>
    </div>
  );
}
