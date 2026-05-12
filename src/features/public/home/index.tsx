import Hero from "./components/Hero";
import StatsSection from "./components/StatsSection";
import ActivityTypesSection from "./components/ActivityTypesSection";
import FeaturedFleetSection from "./components/FeaturedFleetSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FAQSection from "./components/FAQSection";
import ContactSection from "../Contact/ContactFeature";
import { useHomeData } from "./hooks/useHomeData";
import Loader from "@/components/feedback/Loader";
import { CheckCircle2, ShieldCheck, Zap, Clock } from "lucide-react";

export default function HomeFeature() {
  const { stats, activityTypes, featuredBuses, reviews, loading } = useHomeData();

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Hero />
      
      {/* Stats Divider */}
      <div className="bg-white border-b border-slate-50">
        <StatsSection stats={stats} />
      </div>

      {/* Services Section */}
      <div id="services" className="relative bg-white py-4">
        <ActivityTypesSection activityTypes={activityTypes} />
      </div>

      {/* Fleet Catalog */}
      <section id="armada" className="bg-slate-50/60 py-8 rounded-3xl mx-4 lg:mx-8">
        <FeaturedFleetSection buses={featuredBuses} />
      </section>

      {/* Why Choose Us Section */}
      <section id="features" className="relative bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[11px] font-semibold uppercase tracking-wider border border-slate-100 mb-5">
                  <ShieldCheck size={13} />
                  Komitmen Kami
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
                  Standar Baru dalam{" "}
                  <br className="hidden sm:block" />
                  <span className="text-orange-500">Perjalanan Anda.</span>
                </h2>
                <p className="mt-5 text-base font-medium text-slate-400 leading-relaxed max-w-lg">
                  Lebih dari sekadar transportasi, kami memberikan standar baru dalam perjalanan rombongan dengan kenyamanan maksimal dan keamanan terjamin.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { 
                    title: "Armada Modern", 
                    desc: "Seleksi unit terbaru dengan fitur kenyamanan premium.",
                    icon: Zap
                  },
                  { 
                    title: "Driver Ahli", 
                    desc: "Kru profesional dengan sertifikasi dan jam terbang tinggi.",
                    icon: CheckCircle2
                  },
                  { 
                    title: "Harga Jujur", 
                    desc: "Transparansi biaya tanpa biaya tambahan tersembunyi.",
                    icon: ShieldCheck
                  },
                  { 
                    title: "24/7 Siaga", 
                    desc: "Dukungan operasional penuh di setiap rute perjalanan.",
                    icon: Clock
                  },
                ].map((feature) => (
                  <div key={feature.title} className="flex flex-col gap-3 p-6 rounded-xl bg-white border border-slate-100 hover:border-orange-100 hover:shadow-md hover:shadow-orange-50/50 transition-all duration-300 group">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                      <feature.icon size={18} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{feature.title}</h4>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Trust Card */}
            <div className="relative">
              <div className="relative bg-slate-900 rounded-3xl p-12 shadow-2xl overflow-hidden group border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
                
                <div className="relative z-10 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6 transition-transform group-hover:scale-110 duration-500">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <p className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-orange-500 mb-3">98%</p>
                  <h3 className="text-xl font-bold text-white mb-3">Customer Trust</h3>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Indeks kepuasan pelanggan kami mencerminkan komitmen terhadap kualitas layanan di setiap perjalanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <div id="testimonials">
        <TestimonialsSection reviews={reviews} />
      </div>

      {/* FAQ Section */}
      <FAQSection />

    </>
  );
}
