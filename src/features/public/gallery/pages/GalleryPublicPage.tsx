import { useState, useEffect } from "react"
import PublicLayout from "@/layouts/public/PublicLayout"
import { galleryService } from "@/features/admin/galleries/services/GalleryService"
import type { Gallery } from "@/features/admin/galleries/types/Gallery"
import { Calendar, Image as ImageIcon } from "lucide-react"

export default function GalleryPublicPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<{url: string, title: string} | null>(null)

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true)
        const response = await galleryService.getPublic()
        setGalleries(response.data)
      } catch (error) {
        console.error("Failed to fetch public galleries:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchGalleries()
  }, [])

  return (
    <PublicLayout>
      <div className="pt-32 pb-24 min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header Section */}
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-cloud-mist text-action-blue text-xs font-bold tracking-[0.2em] uppercase mb-6">
              Dokumentasi
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-midnight-indigo tracking-tight mb-6">
              Galeri Perjalanan
            </h1>
            <p className="text-lg text-steel-gray leading-relaxed">
              Kumpulan momen terbaik dari setiap perjalanan bersama Boneh Star. 
              Membangun memori, mengutamakan kenyamanan.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="relative flex h-12 w-12 items-center justify-center">
                <div className="absolute h-full w-full animate-[spin_2s_linear_infinite] rounded-full border-2 border-platinum-tint border-t-action-blue" />
                <div className="absolute h-8 w-8 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-platinum-tint border-b-midnight-indigo" />
              </div>
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-24 bg-cloud-mist/30 rounded-3xl border border-platinum-tint">
              <ImageIcon className="mx-auto h-16 w-16 text-platinum-tint mb-6" strokeWidth={1} />
              <h3 className="text-2xl font-bold text-midnight-indigo mb-3 tracking-tight">Belum Ada Album</h3>
              <p className="text-steel-gray max-w-md mx-auto">Dokumentasi perjalanan akan segera hadir di halaman ini. Pantau terus pembaruan dari kami.</p>
            </div>
          ) : (
            <div className="space-y-32">
              {galleries.map((gallery) => (
                <section key={gallery.id} className="relative">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="max-w-3xl">
                      <h2 className="text-3xl md:text-4xl font-bold text-midnight-indigo tracking-tight mb-4">
                        {gallery.title}
                      </h2>
                      {gallery.description && (
                        <p className="text-steel-gray text-lg leading-relaxed">
                          {gallery.description}
                        </p>
                      )}
                    </div>
                    {gallery.date && (
                      <div className="flex items-center gap-2.5 text-midnight-indigo bg-cloud-mist/80 border border-platinum-tint px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide whitespace-nowrap backdrop-blur-sm shadow-sm">
                        <Calendar size={16} className="text-action-blue" />
                        {new Date(gallery.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                  
                  {gallery.image_urls && gallery.image_urls.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                      {gallery.image_urls.map((url, idx) => (
                        <div 
                          key={idx} 
                          className={`
                            relative overflow-hidden rounded-2xl cursor-pointer group bg-cloud-mist
                            ${idx === 0 && gallery.image_urls!.length >= 3 ? 'sm:col-span-2 sm:row-span-2 aspect-auto h-full' : 'aspect-square'}
                          `}
                          onClick={() => setSelectedImage({ url, title: gallery.title })}
                        >
                          <img 
                            src={url} 
                            alt={`${gallery.title} - Foto ${idx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.03] grayscale-[20%] group-hover:grayscale-0"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-midnight-indigo/0 group-hover:bg-midnight-indigo/10 transition-colors duration-500" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <span className="bg-white/90 backdrop-blur-md text-midnight-indigo text-xs font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                              Perbesar
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-cloud-mist/50 border border-platinum-tint/50 rounded-2xl p-12 text-center">
                      <p className="text-steel-gray italic font-medium">Belum ada foto yang diunggah untuk acara ini.</p>
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </div>
      </div>

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
            <div className="mt-8 text-white text-lg font-medium tracking-widest uppercase opacity-80 animate-in slide-in-from-bottom-4 duration-500 delay-150">
              {selectedImage.title}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  )
}
