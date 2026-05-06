import { CompanyProfileForm } from "@/features/admin/company-profile"
import { Building2 } from "lucide-react"
import { PageHeader } from "@/components/ui/PageComponents"

export default function CompanyProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Company Profile"
        subtitle="Kelola informasi publik dan profil bisnis perusahaan"
        badge="Pengaturan"
        actions={
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
            <Building2 size={24} />
          </div>
        }
      />

      <div className="rounded-[2.5rem] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)]">
        <CompanyProfileForm />
      </div>
    </div>
  )
}
