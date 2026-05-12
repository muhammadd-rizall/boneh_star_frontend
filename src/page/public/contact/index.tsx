import PublicLayout from "@/layouts/public/PublicLayout";
import ContactFeature from "@/features/public/Contact/ContactFeature";

export default function ContactPage() {
  return (
    <PublicLayout>
      <div className="pt-20">
        <ContactFeature />
      </div>
    </PublicLayout>
  );
}
