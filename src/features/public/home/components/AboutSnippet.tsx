import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";

export default function AboutSnippet() {
  const { ref, inView } = useInView(0.1);
  const { profile } = usePublicCompanyProfile();

  return (
    <section ref={ref} className="py-24 bg-white scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* Left: Image Card */}
          <div className={`relative reveal ${inView ? "in-view" : ""}`}>
            <div className="relative rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/50">
              <img
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1200&auto=format&fit=crop"
                alt={`${profile.company_name || "Boneh Star"} Premium Fleet`}
                className="w-full h-[380px] object-cover transition-transform duration-700 hover:scale-102"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right: Content */}
          <div
            className={`flex flex-col gap-6 text-left reveal ${inView ? "in-view" : ""}`}
            style={{ "--delay": "100ms" } as React.CSSProperties}
          >
            {/* Section Header */}
            <div className="space-y-3">
              <span className="text-[#006bff] text-[11px] font-bold uppercase tracking-[0.25em] block">
                TENTANG KAMI
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-midnight-indigo leading-tight">
                Mitra Transportasi Terpercaya <br className="hidden sm:block" />
                Untuk Perjalanan Anda
              </h2>
              <div className="h-[3px] w-10 rounded-full bg-[#006bff]" />
            </div>

            <p className="text-[14.5px] font-medium leading-relaxed text-slate-blue/80 max-w-xl">
              {profile.description || (
                `${profile.company_name || "Boneh Star"} hadir untuk memberikan solusi transportasi pariwisata terbaik dengan armada modern, fasilitas lengkap, serta pelayanan profesional. Kami berkomitmen untuk menghadirkan pengalaman perjalanan yang aman, nyaman dan berkesan.`
              )}
            </p>

            {/* CTA Text Link */}
            <div className="pt-2">
              <Link
                to="/tentang-kami"
                className="inline-flex items-center gap-2 text-[13.5px] font-extrabold text-[#006bff] hover:text-[#0056cc] transition-colors group cursor-pointer"
              >
                Selengkapnya Tentang Kami
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
