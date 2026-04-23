import type { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { profile } = usePublicCompanyProfile();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_42%,#f8fafc_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(251,191,36,0.14),transparent_28%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header companyProfile={profile} />
        <main className="flex-1">{children}</main>
        <Footer companyProfile={profile} />
      </div>
    </div>
  );
}
