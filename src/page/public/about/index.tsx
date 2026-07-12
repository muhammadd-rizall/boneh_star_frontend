import { useState, useEffect } from "react";
import PublicLayout from "@/layouts/public/PublicLayout";
import { usePublicCompanyProfile } from "@/features/admin/company-profile/hooks/usePublicCompanyProfile";
import { galleryService } from "@/features/admin/galleries/services/GalleryService";
import type { Gallery } from "@/features/admin/galleries/types/Gallery";
import { Compass, ChevronRight, ArrowRight, Image as ImageIcon, Calendar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useAnimations";
import type { CSSProperties } from "react";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";

export default function AboutPage() {
  const { profile } = usePublicCompanyProfile();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{url: string, title: string} | null>(null);
  
  // Hook for scroll animations
  const { ref: heroRef, inView: heroInView } = useInView(0.1);
  const { ref: descRef, inView: descInView } = useInView(0.1);
  const { ref: galleryRef, inView: galleryInView } = useInView(0.1);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.1);

  const logoUrl = profile.logo ? resolveMediaUrl(profile.logo) : null;

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



  return (
    <PublicLayout>
      <div className="bg-white min-h-screen pt-24 pb-20 overflow-hidden">
        
        {/* Editorial Hero Header */}
        <section ref={heroRef} className="relative py-20 border-b border-slate-50/50">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-action-blue/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              
              {/* Left Column: Title & Copy */}
              <div className={`lg:col-span-6 flex flex-col gap-6 text-left reveal ${heroInView ? "in-view" : ""}`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-blue/60 mb-2">
                  <Link to="/" className="hover:text-action-blue transition-colors">Beranda</Link>
                  <ChevronRight size={12} />
                  <span className="text-slate-blue">Tentang Kami</span>
                </div>
                
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-action-blue/10 text-action-blue text-[11px] font-extrabold uppercase tracking-wider border border-action-blue/10 mb-5 shadow-sm">
                    <Compass size={13} />
                    Profil Perusahaan
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-midnight-indigo leading-[1.15]">
                    Mengenal Lebih Dekat <br />
                    <span className="text-action-blue">{profile.company_name || "Boneh Star Pariwisata"}</span>
                  </h1>
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-blue leading-relaxed opacity-75 max-w-xl">
                  Dedikasi tinggi untuk memberikan pelayanan transportasi terbaik. {profile.company_name || "Boneh Star"} hadir sebagai mitra terpercaya perjalanan Anda dengan armada modern dan kenyamanan istimewa.
                </p>
              </div>

              {/* Right Column: Premium Overlapping Images */}
              <div className={`lg:col-span-6 relative flex justify-center items-center reveal ${heroInView ? "in-view" : ""}`} style={{ "--delay": "150ms" } as CSSProperties}>
                <div className="relative w-full max-w-[460px] aspect-[4/3] rounded-[32px] overflow-hidden p-2 bg-white border border-slate-100 shadow-card">
                  <img
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000&auto=format&fit=crop"
                    alt={`${profile.company_name || "Boneh Star"} Bus Exterior`}
                    className="w-full h-full object-cover rounded-[24px]"
                  />
                  {logoUrl && (
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-slate-100/50 flex items-center justify-center">
                      <img
                        src={logoUrl}
                        alt={profile.company_name || "Logo"}
                        className="h-8 w-auto object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-8 -left-6 w-1/2 aspect-square rounded-2xl overflow-hidden p-1.5 bg-white border border-slate-100 shadow-xl hidden sm:block">
                  <img
                    src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=600&auto=format&fit=crop"
                    alt={`${profile.company_name || "Boneh Star"} Bus Interior`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Deskripsi Perusahaan */}
        <section ref={descRef} className="py-24 bg-slate-50/30 border-b border-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              
              {/* Left Column: Bold Quote */}
              <div className={`lg:col-span-5 text-left reveal ${descInView ? "in-view" : ""}`}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-action-blue block mb-4">
                  Kredo Pelayanan
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-midnight-indigo leading-snug">
                  "Menghubungkan destinasi, menyatukan kebersamaan, dan menciptakan momen perjalanan yang tak terlupakan."
                </h2>
                <div className="mt-8 h-1 w-16 bg-action-blue rounded-full" />
              </div>

              {/* Right Column: Detailed Text */}
              <div className={`lg:col-span-7 text-left flex flex-col gap-6 reveal ${descInView ? "in-view" : ""}`} style={{ "--delay": "150ms" } as CSSProperties}>
                <h3 className="text-lg font-bold text-midnight-indigo">Kenyamanan Perjalanan Rombongan Anda Adalah Komitmen Kami</h3>
                <p className="text-sm sm:text-base font-medium text-slate-blue/90 leading-relaxed">
                  {profile.description || 
                    "Menyediakan solusi transportasi pariwisata terpercaya dengan standar layanan premium, armada modern, dan komitmen keselamatan tanpa kompromi untuk kenyamanan perjalanan terbaik Anda."}
                </p>
                <p className="text-sm sm:text-base font-medium text-slate-blue/80 leading-relaxed">
                  Kami mengerti bahwa setiap perjalanan memiliki cerita unik tersendiri. Oleh karena itu, {profile.company_name || "Boneh Star"} hadir dengan memadukan kesiapan kru operasional profesional, armada bus kelas eksekutif yang bersih dan terawat, serta sistem pemesanan yang mudah untuk mewujudkan liburan atau agenda penting Anda secara sempurna.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Galeri Dokumentasi */}
        <section ref={galleryRef} className="py-24 border-b border-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className={`text-center max-w-3xl mx-auto mb-16 flex flex-col items-center reveal ${galleryInView ? "in-view" : ""}`}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-action-blue/10 text-action-blue text-[11px] font-extrabold uppercase tracking-wider border border-action-blue/10 mb-4 shadow-sm">
                <Sparkles size={13} />
                Galeri Dokumentasi
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-midnight-indigo">
                Dokumentasi Perjalanan Kami
              </h2>
              <p className="mt-4 text-sm sm:text-base font-semibold text-slate-blue opacity-70 leading-relaxed">
                Melihat lebih dekat keceriaan dan kenyamanan para penumpang kami dalam menikmati perjalanan bersama {profile.company_name || "Boneh Star"}.
              </p>
            </div>

            {/* Gallery Albums */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <div className="absolute h-full w-full animate-[spin_2s_linear_infinite] rounded-full border-2 border-slate-100 border-t-action-blue" />
                </div>
              </div>
            ) : galleries.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/40 rounded-3xl border border-slate-100 max-w-3xl mx-auto">
                <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" strokeWidth={1.5} />
                <h4 className="text-lg font-bold text-midnight-indigo mb-2">Belum Ada Dokumentasi</h4>
                <p className="text-sm text-slate-blue/60 max-w-md mx-auto">Foto-foto perjalanan armada kami akan segera diunggah oleh pengelola sistem.</p>
              </div>
            ) : (
              <div className={`space-y-16 reveal ${galleryInView ? "in-view" : ""}`}>
                {galleries.map((gallery) => (
                  <div key={gallery.id} className="border-b border-slate-100 pb-12 last:border-0 last:pb-0 text-left">
                    
                    {/* Album Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                      <div className="max-w-2xl">
                        <h3 className="text-xl sm:text-2xl font-bold text-midnight-indigo tracking-tight">
                          {gallery.title}
                        </h3>
                        {gallery.description && (
                          <p className="mt-2 text-xs sm:text-sm font-medium text-slate-blue/60 leading-relaxed">
                            {gallery.description}
                          </p>
                        )}
                      </div>
                      {gallery.date && (
                        <div className="flex items-center gap-2 text-action-blue bg-action-blue/5 border border-action-blue/10 px-4 py-2 rounded-full text-xs font-bold tracking-wide whitespace-nowrap self-start sm:self-auto shadow-sm">
                          <Calendar size={13} />
                          {new Date(gallery.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                    </div>

                    {/* Album Images Grid */}
                    {gallery.image_urls && gallery.image_urls.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {gallery.image_urls.map((url, idx) => (
                          <div 
                            key={idx} 
                            className="relative overflow-hidden rounded-2xl cursor-pointer group bg-slate-50 border border-slate-100 aspect-[4/3] shadow-sm transition-all duration-300 hover:shadow-md"
                            onClick={() => setSelectedImage({ url, title: gallery.title })}
                          >
                            <img 
                              src={url} 
                              alt={`${gallery.title} - Foto ${idx + 1}`} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-midnight-indigo/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <span className="bg-white/90 backdrop-blur-md text-midnight-indigo text-[10px] font-bold px-4 py-2 rounded-full shadow-sm scale-95 group-hover:scale-100 transition-all duration-300">
                                Perbesar
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-8 text-center">
                        <p className="text-xs text-slate-blue/50 italic font-medium">Belum ada foto yang diunggah untuk album ini.</p>
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}

          </div>
        </section>

        {/* CTA Banner */}
        <section ref={ctaRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div 
            className={`rounded-3xl bg-gradient-to-r from-midnight-indigo to-action-blue p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden reveal ${ctaInView ? "in-view" : ""}`}
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 max-w-2xl text-left">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Dapatkan Penawaran Perjalanan Terbaik</h3>
              <p className="mt-3 text-sm sm:text-base text-white/95 leading-relaxed font-semibold opacity-90">
                Pilih armada bus pariwisata yang tepat untuk kebutuhan rombongan Anda. Hubungi kami untuk konsultasi rute dan ketersediaan armada.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 shrink-0 relative z-10 w-full md:w-auto">
              <Link
                to="/armada"
                className="rounded-full bg-white px-8 py-4 text-xs font-bold uppercase tracking-wider text-action-blue hover:bg-slate-50 transition-all text-center shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                Lihat Armada
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                Hubungi Kami
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Luxury Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-[100] bg-midnight-indigo/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 h-12 w-12 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <span className="sr-only">Tutup</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
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
