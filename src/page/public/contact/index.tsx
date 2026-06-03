import PublicLayout from "@/layouts/public/PublicLayout";
import { ContactSection } from "@/features/public";

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="pt-24">
        <ContactSection />
      </div>
    </PublicLayout>
  );
}
