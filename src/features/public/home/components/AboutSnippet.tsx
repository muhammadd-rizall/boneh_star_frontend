import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { motion } from "motion/react";

export default function AboutSnippet() {
  const { profile } = usePublicCompanyProfile();

  const rawDescription = profile.description || `${profile.company_name || "Boneh Star"} hadir untuk memberikan solusi transportasi pariwisata terbaik dengan armada modern, fasilitas lengkap, serta pelayanan profesional. Kami berkomitmen untuk menghadirkan pengalaman perjalanan yang aman, nyaman dan berkesan.`;
  const shortDescription = rawDescription.length > 200 
    ? rawDescription.substring(0, 200).trim() + "..."
    : rawDescription;

  return (
    <section className="py-24 bg-white scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">

          {/* Left: Image Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.04)] border border-slate-100/50">
              <img
                src="/images/image3.jpeg"
                alt={`${profile.company_name || "Boneh Star"} Premium Fleet`}
                className="w-full h-[380px] object-cover transition-transform duration-700 hover:scale-102"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 text-left"
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
              {shortDescription}
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
          </motion.div>

        </div>
      </div>
    </section>
  );
}
