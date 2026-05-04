import Hero from "./components/Hero";
import StatsSection from "./components/StatsSection";
import ActivityTypesSection from "./components/ActivityTypesSection";
import FeaturedFleetSection from "./components/FeaturedFleetSection";
import TestimonialsSection from "./components/TestimonialsSection";
import { useHomeData } from "./hooks/useHomeData";
import Loader from "@/components/feedback/Loader";

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
      <Hero />
      
      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Services/Activity Types Section */}
      <ActivityTypesSection activityTypes={activityTypes} />

      {/* Featured Fleet Section */}
      <FeaturedFleetSection buses={featuredBuses} />

      {/* Modernized Features Section */}
      <section id="features" className="bg-slate-900 py-24 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500 mb-6">Keunggulan Utama</p>
              <h2 className="text-4xl font-black tracking-tight md:text-5xl leading-tight">
                Mengapa Harus <br />
                <span className="text-white/40">Memilih Boneh Star?</span>
              </h2>
              <p className="mt-8 text-lg text-slate-400 leading-relaxed">
                Kami menggabungkan teknologi modern dengan pelayanan personal untuk memastikan setiap perjalanan Anda menjadi standar baru dalam kenyamanan.
              </p>
              
              <div className="mt-12 grid gap-8 sm:grid-cols-2">
                {[
                  { title: "Armada Modern", desc: "Unit kendaraan terbaru dengan standar keamanan internasional." },
                  { title: "Kru Profesional", desc: "Driver bersertifikat dengan jam terbang tinggi di berbagai medan." },
                  { title: "Sistem Terpadu", desc: "Proses booking dan monitoring armada yang transparan." },
                  { title: "Layanan 24/7", desc: "Tim operasional yang siaga mendampingi perjalanan Anda." },
                ].map((feature) => (
                  <div key={feature.title} className="group transition-all">
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors uppercase tracking-widest">{feature.title}</h4>
                    <p className="mt-3 text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative flex justify-center">
              <div className="absolute -inset-20 bg-orange-600/10 rounded-full blur-[120px]" />
              <div className="relative aspect-square w-full max-w-md rounded-[64px] border border-white/10 bg-white/5 backdrop-blur-3xl flex items-center justify-center p-12 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-transparent" />
                <div className="relative z-10">
                  <p className="text-8xl font-black tracking-tighter text-orange-500">98%</p>
                  <p className="mt-6 text-xl font-bold tracking-tight text-white uppercase tracking-[0.1em]">Customer Satisfaction</p>
                  <p className="mt-4 text-xs text-slate-500 leading-relaxed">Berdasarkan data ulasan nyata dari ribuan pelanggan kami di tahun 2023.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection reviews={reviews} />
      
      {/* Call to Action Bottom */}
      <section id="contact" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[48px] bg-slate-900 px-8 py-24 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_40%)]" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl leading-tight">
              Siap Menjelajah Bersama?
            </h2>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 leading-relaxed">
              Dapatkan pengalaman perjalanan rombongan yang tak terlupakan. Hubungi kami sekarang untuk penawaran harga terbaik.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex h-16 items-center justify-center rounded-2xl bg-orange-600 px-12 text-sm font-bold text-white shadow-xl shadow-orange-600/20 transition-all hover:bg-orange-500 active:scale-95"
              >
                Minta Penawaran Gratis
              </a>
              <a
                href="#armada"
                className="inline-flex h-16 items-center justify-center rounded-2xl border border-white/20 px-12 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
              >
                Lihat Katalog Armada
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
