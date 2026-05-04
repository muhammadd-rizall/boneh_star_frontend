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
      <div className="bg-white border-y border-slate-100">
        <StatsSection stats={stats} />
      </div>

      {/* Services Section with Overlapping Design */}
      <div className="relative bg-white pb-20">
        <ActivityTypesSection activityTypes={activityTypes} />
      </div>

      {/* Modern Fleet Catalog */}
      <section className="bg-slate-50 py-24">
        <FeaturedFleetSection buses={featuredBuses} />
      </section>

      {/* Sophisticated Why Choose Us Section */}
      <section id="features" className="relative bg-white py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 [clip-path:polygon(20%_0%,100%_0%,100%_100%,0%_100%)] -z-0" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-24 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-10">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-xs font-black uppercase tracking-widest border border-orange-100 mb-6">
                  <ShieldCheck size={14} />
                  Standar Keunggulan
                </span>
                <h2 className="text-5xl font-black tracking-tight text-slate-900 md:text-6xl leading-[1.1]">
                  Dedikasi Kami Untuk <br />
                  <span className="text-orange-500 italic">Kenyamanan Anda.</span>
                </h2>
                <p className="mt-8 text-lg font-medium text-slate-500 leading-relaxed max-w-xl">
                  Lebih dari sekadar transportasi, kami memberikan standar baru dalam perjalanan rombongan dengan integritas dan inovasi tanpa henti.
                </p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
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
                    desc: "Transparansi biaya tanpa biaya tambahan yang tersembunyi.",
                    icon: <ShieldCheck size={20} className="text-orange-500" />
                  },
                  { 
                    title: "24/7 Siaga", 
                    desc: "Dukungan operasional penuh di setiap rute perjalanan.",
                    icon: <Zap size={20} className="text-orange-500" />
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex flex-col gap-4 p-6 rounded-3xl transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      {feature.icon}
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{feature.title}</h4>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-10 bg-orange-600/5 rounded-full blur-[100px]" />
              <div className="relative bg-slate-900 rounded-[64px] p-16 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.2),transparent_50%)]" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-8 transition-transform group-hover:scale-110 duration-500">
                    <span className="text-4xl">⭐</span>
                  </div>
                  <p className="text-8xl font-black tracking-tighter text-orange-500 mb-4">98%</p>
                  <h3 className="text-2xl font-bold text-white mb-4">Customer Trust</h3>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed">
                    Indeks kepuasan pelanggan kami mencerminkan komitmen terhadap kualitas layanan di setiap perjalanan.
                  </p>
                  
                  <div className="mt-12 flex justify-center gap-2">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1.5 w-8 rounded-full bg-white/10" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with Minimalist Frame */}
      <TestimonialsSection reviews={reviews} />

      {/* Additional FAQ Section */}
      <FAQSection />
      
      {/* Editorial Style CTA */}
      <section id="contact" className="bg-white py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[80px] bg-slate-950 p-12 lg:p-24 text-center">
            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950 to-orange-950/30" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-5xl font-black tracking-tight text-white md:text-7xl leading-none mb-10">
                Wujudkan <br />
                <span className="text-orange-500">Perjalanan</span> Impian.
              </h2>
              <p className="text-xl font-medium text-slate-400 leading-relaxed mb-16 max-w-2xl mx-auto">
                Dapatkan penawaran eksklusif yang disesuaikan khusus untuk kebutuhan transportasi rombongan Anda.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="#contact"
                  className="w-full sm:w-auto inline-flex h-16 items-center justify-center rounded-2xl bg-orange-600 px-12 text-sm font-black text-white shadow-2xl shadow-orange-600/20 transition-all hover:bg-orange-500 active:scale-95 group"
                >
                  Mulai Sekarang
                  <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#armada"
                  className="w-full sm:w-auto inline-flex h-16 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-12 text-sm font-black text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
                >
                  Lihat Katalog
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
