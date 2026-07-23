import { useState, useEffect, useCallback, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import type { Review } from "@/features/admin/reviews/types/Review";

interface TestimonialsSectionProps {
  reviews?: Review[];
}

// Fallback reviews matching production layout
const fallbackReviews = [
  {
    id: "sample-1",
    rating: 5,
    comment: "Pelayanan sangat memuaskan, bus bersih dan nyaman. Driver juga ramah dan berpengalaman.",
    name: "Siti Aisyah",
    subtext: "Study Tour Padang",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "sample-2",
    rating: 5,
    comment: "Perjalanan wisata keluarga kami berjalan sangat lancar dan tepat waktu. Pasti akan order lagi!",
    name: "Roni Saputra",
    subtext: "Family Gathering",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "sample-3",
    rating: 5,
    comment: "Armada bagus, fasilitas lengkap, AC dingin, dan harga terjangkau. Highly recommended!",
    name: "Dewi Kumala",
    subtext: "Ziarah & Wisata Religi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "sample-4",
    rating: 5,
    comment: "Kondisi bus prima, perjalanan jauh terasa nyaman. Fasilitas karaoke dan charger membuat anak-anak betah.",
    name: "Budi Santoso",
    subtext: "Kunjungan Kerja Perusahaan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "sample-5",
    rating: 5,
    comment: "Sangat responsif dan kooperatif. Sewa armada untuk acara nikahan keluarga besar berjalan sempurna.",
    name: "Fitri Handayani",
    subtext: "Rombongan Pernikahan",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop"
  }
];

// Helper Component for Avatar with Default Person Icon Fallback
function TestimonialAvatar({ src, name }: { src?: string | null; name: string }) {
  const [hasError, setHasError] = useState(false);
  const resolvedUrl = src ? resolveMediaUrl(src) : null;

  if (resolvedUrl && !hasError) {
    return (
      <img
        src={resolvedUrl}
        alt={name}
        className="h-11 w-11 shrink-0 rounded-full object-cover border-2 border-white shadow-sm"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div className="h-11 w-11 shrink-0 rounded-full bg-blue-50 border-2 border-white shadow-sm flex items-center justify-center text-[#006bff]">
      <User size={20} strokeWidth={2} />
    </div>
  );
}

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const { ref, inView } = useInView(0.1);

  // Normalize base reviews list from backend database
  const displayReviews = (reviews && reviews.length > 0)
    ? reviews.map((r, idx) => {
        const customerPhoto = (r.customer as any)?.profile_picture || (r.customer as any)?.avatar || (r.customer as any)?.photo;
        return {
          id: r.id || `api-${idx}`,
          rating: r.rating || 5,
          comment: r.comment || "Layanan armada pariwisata yang luar biasa!",
          name: r.customer?.name || "Pelanggan Setia",
          subtext: r.booking?.activity?.name || "Perjalanan Pariwisata",
          avatar: customerPhoto || null,
        };
      })
    : fallbackReviews;

  const totalReviews = displayReviews.length;

  // Calculate visible count per screen width
  const getVisibleCount = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const [visibleCount, setVisibleCount] = useState(getVisibleCount());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef<number>(0);
  const dragDistance = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Maximum valid slide index
  const maxIndex = Math.max(0, totalReviews - visibleCount);

  // Ensure index stays in valid range when window resizes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || maxIndex === 0) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, handleNext, maxIndex]);

  // Drag & Touch Swipe Handlers
  const handleDragStart = (clientX: number) => {
    setIsAutoPlaying(false);
    setIsDragging(true);
    startX.current = clientX;
    dragDistance.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    dragDistance.current = startX.current - clientX;
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const minSwipeDistance = 35;

    if (dragDistance.current > minSwipeDistance) {
      handleNext();
    } else if (dragDistance.current < -minSwipeDistance) {
      handlePrev();
    }

    dragDistance.current = 0;
    setIsAutoPlaying(true);
  };

  // Helper render bintang
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, idx) => (
          <Star
            key={idx}
            size={16}
            className={idx < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
          />
        ))}
      </div>
    );
  };

  // Total dot indicators
  const totalDots = maxIndex + 1;

  return (
    <div ref={ref} className="py-24 bg-gradient-to-b from-white via-slate-50/50 to-white scroll-mt-24 select-none overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header section centered */}
        <div className={`mb-16 text-center flex flex-col items-center reveal ${inView ? "in-view" : ""}`}>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#006bff] mb-3 block">
            APA KATA PELANGGAN KAMI?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Testimoni Pelanggan
          </h2>
          <div className="mt-4 h-[3px] w-12 rounded-full bg-[#006bff]" />
        </div>

        {/* Carousel Slider Container */}
        <div 
          className="relative group overflow-hidden py-4 cursor-grab active:cursor-grabbing touch-pan-y"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          // Touch events
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
          // Mouse drag events
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
        >
          {/* Side Navigation Arrows (Hover on Desktop) */}
          {maxIndex > 0 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAutoPlaying(false);
                  handlePrev();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
                aria-label="Testimoni Sebelumnya"
              >
                <ChevronLeft size={20} strokeWidth={2.2} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAutoPlaying(false);
                  handleNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md border border-slate-200 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 cursor-pointer"
                aria-label="Testimoni Selanjutnya"
              >
                <ChevronRight size={20} strokeWidth={2.2} />
              </button>
            </>
          )}

          {/* Slider Track */}
          <div 
            className="flex -mx-3 transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`
            }}
          >
            {displayReviews.map((review, idx) => (
              <div
                key={review.id || idx}
                className="w-full sm:w-1/2 lg:w-1/3 px-3 shrink-0 flex flex-col"
              >
                <div className="relative flex flex-col h-full rounded-[28px] bg-white p-8 border border-slate-100/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(0,107,255,0.08)] hover:border-blue-200/60 transition-all duration-300 text-left">
                  
                  {/* Decorative Quote Icon */}
                  <div className="absolute top-6 right-6 text-blue-100 select-none pointer-events-none">
                    <Quote size={36} strokeWidth={1.5} />
                  </div>

                  {/* Rating Stars */}
                  <div className="mb-5 z-10">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment Text */}
                  <p className="flex-1 text-sm font-medium leading-relaxed text-slate-600 mb-8 z-10 pointer-events-none line-clamp-4">
                    "{review.comment}"
                  </p>

                  {/* Customer Profile Info */}
                  <div className="flex items-center gap-4 pt-5 border-t border-slate-100/80 mt-auto z-10 pointer-events-none">
                    <TestimonialAvatar src={review.avatar} name={review.name} />
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 truncate">{review.name}</p>
                      <p className="text-xs font-semibold text-[#006bff] truncate">
                        {review.subtext}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Indicator Dots */}
        {totalDots > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {Array.from({ length: totalDots }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx 
                    ? "w-8 bg-[#006bff]" 
                    : "w-2.5 bg-slate-200 hover:bg-slate-300"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
