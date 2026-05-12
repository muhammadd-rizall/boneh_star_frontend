import PublicLayout from "@/layouts/public/PublicLayout";
import Hero from "@/features/public/home/components/Hero";
import StatsSection from "@/features/public/home/components/StatsSection";
import ActivityTypesSection from "@/features/public/home/components/ActivityTypesSection";
import FeaturedFleetSection from "@/features/public/home/components/FeaturedFleetSection";
import TestimonialsSection from "@/features/public/home/components/TestimonialsSection";
import FAQSection from "@/features/public/home/components/FAQSection";
import { useHomeData } from "@/features/public/home/hooks/useHomeData";
import Loader from "@/components/feedback/Loader";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { stats, activityTypes, featuredBuses, reviews, loading } = useHomeData();

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex h-[80vh] items-center justify-center bg-white">
          <Loader />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <Hero />
      
      {/* Clean Stats Divider */}
      <div className="bg-white border-y border-slate-50">
        <StatsSection stats={stats} />
      </div>

      {/* Services Section */}
      <div className="relative bg-white py-24">
        <ActivityTypesSection activityTypes={activityTypes} />
      </div>

      {/* Modern Fleet Catalog */}
      <section className="bg-slate-50/50 py-32 rounded-[4rem] mx-4 lg:mx-8">
        <FeaturedFleetSection buses={featuredBuses} />
      </section>

      {/* Why Choose Us Section */}
      <section id="features" className="relative bg-white py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-24 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-10">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 mb-6">
                  <ShieldCheck size={14} />
                  Komitmen Kami
                </span>
                <h2 className="text-5xl font-black tracking-tighter text-slate-950 md:text-6xl leading-[1]">
                  Standar Baru dalam <br />
                  <span className="text-orange-500 italic">Perjalanan Anda.</span>
                </h2>
                <p className="mt-8 text-lg font-medium text-slate-500 leading-relaxed max-w-xl">
                  Lebih dari sekadar transportasi, kami memberikan standar baru dalam perjalanan rombongan dengan kenyamanan maksimal dan keamanan terjamin.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {[
                  { 
                    title: "Armada Modern", 
                    desc: "Seleksi unit terbaru dengan fitur kenyamanan premium.",
                    icon: <Zap size={20} className="text-orange-500" />
                  },
                  { 
                    title: "Driver Ahli", 
                    desc: "Kru profesional dengan sertifikasi dan jam terbang tinggi.",
                    icon: <CheckCircle2 size={20} className="text-orange-500" />
                  },
                  { 
                    title: "Harga Jujur", 
                    desc: "Transparansi biaya tanpa biaya tambahan tersembunyi.",
                    icon: <ShieldCheck size={20} className="text-orange-500" />
                  },
                  { 
                    title: "24/7 Siaga", 
                    desc: "Dukungan operasional penuh di setiap rute perjalanan.",
                    icon: <Zap size={20} className="text-orange-500" />
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-white border border-slate-50 shadow-sm shadow-slate-100 hover:shadow-md transition-all group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-900 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      {feature.icon}
                    </div>
                    <h4 className="text-sm font-black text-slate-950 uppercase tracking-widest">{feature.title}</h4>
                    <p className="text-xs font-semibold text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-slate-950 rounded-[4rem] p-16 shadow-2xl overflow-hidden group border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8 transition-transform group-hover:scale-110 duration-500">
                    <span className="text-4xl">⭐</span>
                  </div>
                  <p className="text-8xl font-black tracking-tighter text-orange-500 mb-4">98%</p>
                  <h3 className="text-2xl font-bold text-white mb-4">Customer Trust</h3>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed">
                    Indeks kepuasan pelanggan kami mencerminkan komitmen terhadap kualitas layanan di setiap perjalanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection reviews={reviews} />

      {/* FAQ Section */}
      <FAQSection />
      
      {/* Editorial Style CTA */}
      <section id="contact" className="bg-white py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[5rem] bg-slate-950 p-12 lg:p-24 text-center border border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.1),transparent_50%)]" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl font-black tracking-tighter text-white md:text-7xl leading-[0.9] mb-10">
                Wujudkan <br />
                <span className="text-orange-500">Perjalanan</span> Impian.
              </h2>
              <p className="text-xl font-medium text-slate-400 leading-relaxed mb-16 max-w-2xl mx-auto">
                Dapatkan penawaran eksklusif yang disesuaikan khusus untuk kebutuhan transportasi rombongan Anda.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-2xl bg-orange-600 hover:bg-orange-500 shadow-xl shadow-orange-600/20"
                  suffix={ArrowRight}
                >
                  Mulai Sekarang
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-2xl border-white/10 bg-white/5 text-white hover:bg-white/10 shadow-none"
                >
                  Lihat Katalog
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
