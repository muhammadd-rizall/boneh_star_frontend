import { Link } from "react-router-dom";
import { ArrowRight, Compass, ShieldCheck, Heart } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";
import { Button } from "@/components/ui/Button";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";

export default function AboutSnippet() {
  const { ref, inView } = useInView(0.1);
  const { profile } = usePublicCompanyProfile();


  return (
    <section ref={ref} className="py-24 bg-slate-50/50 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Premium Image & Floating Badge */}
          <div className={`lg:col-span-6 relative reveal ${inView ? "in-view" : ""}`}>
            <div className="relative rounded-[32px] overflow-hidden shadow-card border border-slate-100 bg-white p-2">
              <img
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1200&auto=format&fit=crop"
                alt={`${profile.company_name || "Boneh Star"} Premium Fleet`}
                className="w-full h-[380px] object-cover rounded-[24px]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-midnight-indigo/20 to-transparent rounded-[24px]" />
              
            
            </div>
          </div>

          {/* Right Column: Copywriting & Actions */}
          <div className={`lg:col-span-6 flex flex-col gap-6 text-left reveal ${inView ? "in-view" : ""}`} style={{ "--delay": "100ms" } as React.CSSProperties}>
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-action-blue/10 text-action-blue text-[11px] font-extrabold uppercase tracking-wider border border-action-blue/10 mb-5 shadow-sm">
                <Compass size={13} />
                TENTANG KAMI
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-midnight-indigo leading-tight">
                Mitra Transportasi Terpercaya <br />
                Untuk <span className="text-action-blue">Perjalanan Anda.</span>
              </h2>
            </div>

            <p className="text-sm font-medium text-slate-blue leading-relaxed opacity-85 whitespace-pre-line">
              {profile.description || (
                `${profile.company_name || "Boneh Star"} hadir untuk memberikan solusi sewa armada bus premium dengan komitmen tinggi pada aspek keselamatan, kenyamanan, dan profesionalisme. Kami mendampingi setiap agenda perjalanan Anda—mulai dari wisata keluarga, acara gathering kantor, study tour sekolah, hingga kebutuhan ziarah.`
              )}
            </p>

            {/* Core Values List */}
            <div className="grid gap-4 mt-2">
              {[
                {
                  title: "Keselamatan Terjamin",
                  desc: "Setiap armada melalui uji kelayakan berkala yang ketat.",
                  icon: ShieldCheck
                },
                {
                  title: "Kenyamanan Maksimal",
                  desc: "Fasilitas premium modern untuk perjalanan jauh yang menyenangkan.",
                  icon: Heart
                }
              ].map((val, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-action-blue/10 text-action-blue shadow-sm">
                    <val.icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-midnight-indigo">{val.title}</h4>
                    <p className="text-xs font-semibold text-slate-blue/70 mt-0.5 leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link to="/tentang-kami">
                <Button
                  variant="outline"
                  className="rounded-full px-8 h-12 text-xs font-extrabold border-slate-200 text-slate-700 hover:border-action-blue hover:text-action-blue bg-white shadow-sm flex items-center gap-2"
                >
                  Selengkapnya Tentang Kami
                  <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
