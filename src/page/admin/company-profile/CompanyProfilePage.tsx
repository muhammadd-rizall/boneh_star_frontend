import { CompanyProfileForm } from "@/features/admin/company-profile"
import { Building2 } from "lucide-react"

export default function CompanyProfilePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_28px_60px_-42px_rgba(15,23,42,0.4)]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">System Settings</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Company Profile</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Building2 size={24} />
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-[32px] border border-slate-200/80 bg-white/90 p-8 shadow-[0_24px_50px_-40px_rgba(15,23,42,0.35)]">
        <CompanyProfileForm />
      </div>
    </div>
  )
}
