import { CompanyProfileForm } from "@/features/admin/company-profile"
import { Building2 } from "lucide-react"
import { PageHeader } from "@/components/ui/PageComponents"

export default function CompanyProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Company Profile"
        subtitle="Kelola informasi publik dan profil bisnis perusahaan"
        badge="Pengaturan"
        actions={
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-platinum-tint/70 bg-cloud-mist text-action-blue shadow-sm">
            <Building2 size={24} />
          </div>
        }
      />

      <div className="rounded-[2rem] border border-platinum-tint/70 bg-white/95 p-4 shadow-sm sm:p-6">
        <CompanyProfileForm />
      </div>
    </div>
  )
}
