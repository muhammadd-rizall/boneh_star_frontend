import { useState, useEffect } from "react";
import PublicLayout from "@/layouts/public/PublicLayout";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { galleryService } from "@/features/admin/galleries/services/GalleryService";
import type { Gallery } from "@/features/admin/galleries/types/Gallery";
import { ChevronRight, ArrowRight, Image as ImageIcon, ShieldCheck, Bus, Users, Clock, Headphones, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useAnimations";
import type { CSSProperties } from "react";
import { buildWhatsAppHref } from "@/features/admin/company-profile/utils/companyProfileUtils";

export default function AboutPage() {
  const { profile } = usePublicCompanyProfile();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string, title: string } | null>(null);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [limit, setLimit] = useState(8);
  const [isExpanded, setIsExpanded] = useState(false);

  // Hook for scroll animations
  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const { ref: descRef, inView: descInView } = useInView(0.1);
  const { ref: galleryRef, inView: galleryInView } = useInView(0.1);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.1);

  const whatsappHref = profile.whatsapp?.[0]
    ? buildWhatsAppHref(profile.whatsapp[0])
    : "#";

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response = await galleryService.getPublic();
        setGalleries(response.data);
      } catch (error) {
        console.error("Failed to fetch public galleries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGalleries();
  }, []);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setLimit(8);
  };

  // Helper to categorize images dynamically
  const getCategoryForImage = (_url: string, title: string, desc: string): string => {
    const t = `${title} ${desc}`.toLowerCase();

    if (t.includes("gathering") || t.includes("kegiatan") || t.includes("acara") || t.includes("petrokimia")) {
      return "Kegiatan";
    }

    if (t.includes("bali") || t.includes("ziarah") || t.includes("study tour") || t.includes("perjalanan") || t.includes("wisata") || t.includes("tour")) {
      return "Perjalanan";
    }

    return "Lainnya";
  };

  // All images
  const allImages = galleries.flatMap((g) =>
    (g.image_urls || []).map((url) => ({
      url,
      title: g.title,
      description: g.description || "",
      date: g.date,
      category: getCategoryForImage(url, g.title, g.description || ""),
    }))
  );

  const combinedImages = [...allImages];

  const categories = ["Semua", "Kegiatan", "Perjalanan", "Lainnya"];

  const filteredImages = combinedImages.filter((img) => {
    if (activeCategory === "Semua") return true;
    return img.category === activeCategory;
  });

  const displayedImages = filteredImages.slice(0, limit);

  return (
    <PublicLayout>
      <div className="bg-white min-h-screen pt-24 pb-20 overflow-hidden">

        {/* Editorial Hero Header */}
        <section ref={heroRef} className="relative py-20 border-b border-slate-50/50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-action-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">

              {/* Left Column: Title & Copy */}
              <div className={`lg:col-span-6 flex flex-col gap-5 text-left reveal ${heroInView ? "in-view" : ""}`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-blue/60 mb-2">
                  <Link to="/" className="hover:text-action-blue transition-colors">Beranda</Link>
                  <ChevronRight size={12} />
                  <span className="text-slate-blue">Tentang Kami</span>
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-action-blue block mb-3">
                    TENTANG KAMI
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-slate-900 leading-[1.2]">
                    Mengenal Lebih Dekat <br />
                    <span className="text-action-blue">Boneh Star</span> Pariwisata
                  </h1>
                  <div className="mt-4 h-1 w-16 bg-action-blue rounded-full" />
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed opacity-95 max-w-xl mt-2">
                  {profile.company_name || "Boneh Star"} Pariwisata adalah perusahaan yang bergerak di bidang layanan transportasi pariwisata. Kami hadir untuk memberikan pengalaman perjalanan terbaik dengan armada modern, pelayanan profesional, dan komitmen penuh terhadap kenyamanan pelanggan.
                </p>
              </div>

              {/* Right Column: Premium Large Rounded Image */}
              <div className={`lg:col-span-6 relative flex justify-center items-center reveal ${heroInView ? "in-view" : ""}`} style={{ "--delay": "150ms" } as CSSProperties}>
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-[24px] overflow-hidden shadow-lg border border-slate-100">
                  <img
                    src="/images/image1.jpeg"
                    alt={`${profile.company_name || "Boneh Star"} Bus Exterior`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Tentang Boneh Star Pariwisata */}
        <section ref={descRef} className="py-24 bg-slate-50/30 border-b border-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">

              {/* Left Column: Title & Description */}
              <div className={`lg:col-span-6 text-left flex flex-col gap-5 reveal ${descInView ? "in-view" : ""}`}>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug">
                  Tentang {profile.company_name || "Boneh Star"} Pariwisata
                </h2>
                {(() => {
                  const descText = profile.description || "Sejak berdiri, Boneh Star Pariwisata terus berkomitmen memberikan layanan transportasi pariwisata yang aman, nyaman, dan terpercaya. Kami melayani berbagai kebutuhan perjalanan seperti wisata, ziarah, studi tour, perjalanan dinas, hingga event perusahaan.\n\nDengan dukungan armada yang terawat dan tim yang berpengalaman, kami siap menjadi mitra perjalanan terbaik untuk setiap momen berharga Anda.";
                  const isLongText = descText.length > 300;
                  const displayedText = isLongText && !isExpanded ? descText.substring(0, 300) + "..." : descText;
                  
                  return (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm sm:text-base font-semibold text-slate-600 leading-relaxed opacity-95 whitespace-pre-line">
                        {displayedText}
                      </p>
                      {isLongText && (
                        <button
                          type="button"
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="text-xs font-extrabold text-action-blue hover:text-[#0052cc] transition-colors cursor-pointer self-start border border-action-blue/10 bg-action-blue/5 hover:bg-action-blue/10 px-3.5 py-2 rounded-full"
                        >
                          {isExpanded ? "Sembunyikan" : "Baca Selengkapnya"}
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Grid 2x2 of pillars */}
              <div className={`lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-8 text-left reveal ${descInView ? "in-view" : ""}`} style={{ "--delay": "150ms" } as CSSProperties}>
                {/* Pilar 1 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-action-blue/10 flex items-center justify-center text-action-blue shadow-sm border border-action-blue/5">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Aman & Nyaman</h4>
                    <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                      Keselamatan dan kenyamanan pelanggan adalah prioritas utama kami.
                    </p>
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-action-blue/10 flex items-center justify-center text-action-blue shadow-sm border border-action-blue/5">
                    <Bus size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Armada Terawat</h4>
                    <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                      Armada modern dan selalu dalam kondisi prima dengan perawatan rutin.
                    </p>
                  </div>
                </div>

                {/* Pilar 3 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-action-blue/10 flex items-center justify-center text-action-blue shadow-sm border border-action-blue/5">
                    <Users size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Pelayanan Profesional</h4>
                    <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                      Tim kami berpengalaman dan siap memberikan pelayanan terbaik.
                    </p>
                  </div>
                </div>

                {/* Pilar 4 */}
                <div className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-action-blue/10 flex items-center justify-center text-action-blue shadow-sm border border-action-blue/5">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Tepat Waktu</h4>
                    <p className="mt-1.5 text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
                      Kami berkomitmen untuk selalu tepat waktu di setiap perjalanan.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Galeri Dokumentasi */}
        <section ref={galleryRef} className="py-24 border-b border-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className={`text-center max-w-3xl mx-auto mb-12 flex flex-col items-center reveal ${galleryInView ? "in-view" : ""}`}>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-action-blue block mb-3">
                GALERI KAMI
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Dokumentasi Perjalanan & Kegiatan
              </h2>
              <div className="mt-4 h-1 w-16 bg-action-blue rounded-full mb-8" />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border shadow-sm ${activeCategory === category
                      ? "bg-action-blue border-action-blue text-white"
                      : "bg-white border-slate-200 text-slate-650 hover:text-action-blue hover:border-action-blue hover:bg-slate-50/50"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Gallery Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <div className="absolute h-full w-full animate-[spin_2s_linear_infinite] rounded-full border-2 border-slate-100 border-t-action-blue" />
                </div>
              </div>
            ) : displayedImages.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/40 rounded-3xl border border-slate-100 max-w-3xl mx-auto">
                <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" strokeWidth={1.5} />
                <h4 className="text-lg font-bold text-slate-900 mb-2">Belum Ada Dokumentasi</h4>
                <p className="text-sm text-slate-550 max-w-md mx-auto">Foto-foto perjalanan armada kami akan segera diunggah oleh pengelola sistem.</p>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {displayedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative overflow-hidden rounded-2xl cursor-pointer group bg-slate-50 border border-slate-100 aspect-[4/3] shadow-sm transition-all duration-300 hover:shadow-md"
                      onClick={() => setSelectedImage({ url: img.url, title: img.title })}
                    >
                      <img
                        src={img.url}
                        alt={`${img.title} - Foto ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-bold px-4 py-2 rounded-full shadow-sm scale-95 group-hover:scale-100 transition-all duration-300">
                          Perbesar
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lihat Semua Galeri Button */}
                {filteredImages.length > limit && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={() => setLimit(filteredImages.length)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 bg-white text-xs font-bold uppercase tracking-wider text-slate-700 hover:border-action-blue hover:text-action-blue hover:bg-slate-50/50 transition-colors shadow-sm"
                    >
                      <ImageIcon size={14} />
                      Lihat Semua Galeri
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>

        {/* CTA Banner */}
        <section ref={ctaRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div
            className={`rounded-[28px] bg-white border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.07)] overflow-hidden flex flex-col lg:flex-row relative reveal ${ctaInView ? "in-view" : ""}`}
          >
            {/* Left Side: Copy and Stats */}
            <div className="w-full lg:w-[58%] p-8 sm:p-10 lg:p-12 flex flex-col justify-between text-left z-10">
              <div>
                {/* SIAP MELAYANI BADGE */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-action-blue text-[11px] font-bold tracking-wider border border-blue-100 w-fit mb-6">
                  <Bus size={13} strokeWidth={2.5} />
                  <span>SIAP MELAYANI PERJALANAN ANDA</span>
                </div>

                {/* HEADING */}
                <h3 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-4 max-w-md">
                  Dapatkan Penawaran<br />
                  Perjalanan <span className="text-action-blue">Terbaik</span>
                </h3>

                {/* DESCRIPTION */}
                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                  Kami siap membantu Anda menemukan armada terbaik sesuai kebutuhan perjalanan.
                </p>
              </div>

              {/* STATS / FEATURES LIST (3 Items) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-left pt-8 mt-8 border-t border-slate-100">
                {/* Feature 1 */}
                <div className="flex flex-col gap-3 pr-0 pb-6 sm:pr-6 sm:pb-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-action-blue">
                    <ShieldCheck size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Aman & Nyaman</h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">Keselamatan adalah prioritas utama kami.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col gap-3 px-0 py-6 sm:px-6 sm:py-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-action-blue">
                    <Clock size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Tepat Waktu</h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">Berangkat sesuai jadwal, sampai tepat tujuan.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col gap-3 pl-0 pt-6 sm:pl-6 sm:pt-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-action-blue">
                    <Headphones size={18} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Layanan Profesional</h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">Tim berpengalaman siap membantu Anda.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Buttons + Trust Text */}
            <div className="w-full lg:w-[42%] p-8 sm:p-10 lg:p-12 flex flex-col justify-center gap-4 z-10 bg-slate-50/60 lg:border-l lg:border-slate-100 relative overflow-hidden">
              {/* Dot grid decoration */}
              <div className="absolute top-5 right-5 grid grid-cols-6 gap-[7px] opacity-25 pointer-events-none select-none">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-action-blue" />
                ))}
              </div>

              {/* LIHAT ARMADA BUTTON */}
              <Link
                to="/armada"
                className="group inline-flex items-center justify-between gap-3 px-6 py-4 bg-action-blue hover:bg-[#0056cc] text-white text-sm font-bold rounded-2xl transition-all shadow-[0_4px_16px_rgba(0,107,255,0.3)] hover:shadow-[0_8px_24px_rgba(0,107,255,0.4)] hover:scale-[1.02] active:scale-[0.98] w-full"
              >
                <div className="flex items-center gap-3">
                  <Bus size={18} strokeWidth={2} />
                  <span>Lihat Armada</span>
                </div>
                <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              {/* HUBUNGI KAMI BUTTON */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-3 px-6 py-4 bg-white hover:bg-blue-50 text-action-blue text-sm font-bold rounded-2xl border border-slate-200 hover:border-action-blue/30 transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] w-full"
              >
                <div className="flex items-center gap-3">
                  <Phone size={18} strokeWidth={2} />
                  <span>Hubungi Kami</span>
                </div>
                <ArrowRight size={18} strokeWidth={2} className="group-hover:translate-x-1 transition-transform duration-200" />
              </a>

              {/* Trust line */}
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <ChevronRight size={9} strokeWidth={3} className="text-action-blue" />
                </div>
                <span>Respon cepat • Konsultasi gratis • Tanpa komitmen</span>
              </div>
            </div>
          </div>
        </section>

        {/* Luxury Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <span className="sr-only">Tutup</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            </button>

            <div className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[80vh] object-contain rounded-sm shadow-2xl animate-in zoom-in-95 duration-500"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="mt-8 text-white text-sm font-bold tracking-widest uppercase opacity-80 animate-in slide-in-from-bottom-4 duration-500 delay-150">
                {selectedImage.title}
              </div>
            </div>
          </div>
        )}

      </div>
    </PublicLayout>
  );
}
