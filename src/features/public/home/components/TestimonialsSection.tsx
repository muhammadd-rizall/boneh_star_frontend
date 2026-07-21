import { Star } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

// Static premium testimonials to match the mockup exactly
const premiumReviews = [
  {
    id: "premium-1",
    rating: 5,
    comment: "Pelayanan sangat memuaskan, bus bersih dan nyaman. Driver juga ramah dan berpengalaman.",
    name: "Siti Aisyah",
    subtext: "Study Tour SMA 1 Padang",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "premium-2",
    rating: 4.5,
    comment: "Perjalanan wisata kami berjalan lancar dan tepat waktu. Pasti akan menggunakan lagi!",
    name: "Roni Saputra",
    subtext: "Family Gathering",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"
  },
  {
    id: "premium-3",
    rating: 5,
    comment: "Armada bagus, fasilitas lengkap, harga juga terjangkau. Recommended!",
    name: "Dewi Kumala",
    subtext: "Ziarah & Wisata Religi",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop"
  }
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView(0.1);

  // Star rating renderer helper supporting half-stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, idx) => {
          const starValue = idx + 1;
          if (rating >= starValue) {
            return (
              <Star
                key={idx}
                size={16}
                className="fill-sunset-gold text-sunset-gold"
              />
            );
          } else if (rating >= starValue - 0.5) {
            return (
              <div key={idx} className="relative flex items-center justify-center">
                <Star size={16} className="text-slate-200" />
                <div className="absolute top-0 left-0 overflow-hidden w-[50%] h-full">
                  <Star size={16} className="fill-sunset-gold text-sunset-gold" />
                </div>
              </div>
            );
          } else {
            return (
              <Star
                key={idx}
                size={16}
                className="text-slate-200"
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div ref={ref} className="py-24 bg-white scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header centered */}
        <div className={`mb-16 text-center flex flex-col items-center reveal ${inView ? "in-view" : ""}`}>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#006bff] mb-3 block">
            APA KATA PELANGGAN KAMI?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-midnight-indigo leading-tight">
            Testimoni Pelanggan
          </h2>
          <div className="mt-4 h-[3px] w-12 rounded-full bg-[#006bff]" />
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {premiumReviews.map((review, i) => {
            return (
              <div
                key={review.id}
                className={`group flex flex-col reveal ${inView ? "in-view" : ""}`}
                style={{ "--delay": (i * 100) + "ms" } as React.CSSProperties}
              >
                <div className="relative flex flex-col h-full rounded-[24px] bg-white p-8 border border-slate-100 transition-all duration-300 hover:border-blue-200/50 hover:shadow-[0_12px_30px_rgba(0,107,255,0.04)] shadow-[0_8px_30px_rgba(0,0,0,0.02)] text-left">
                  
                  {/* Rating Stars on Top */}
                  <div className="mb-5">
                    {renderStars(review.rating)}
                  </div>

                  {/* Comment */}
                  <blockquote className="flex-1 text-[13.5px] font-medium leading-relaxed text-slate-blue/90 mb-8">
                    "{review.comment}"
                  </blockquote>

                  {/* Customer Profile Block */}
                  <div className="flex items-center gap-4 pt-5 border-t border-slate-100/60">
                    <img 
                      src={review.avatar} 
                      alt={review.name}
                      className="h-11 w-11 shrink-0 rounded-full object-cover border border-slate-100 shadow-sm"
                    />
                    <div>
                      <p className="text-[14px] font-extrabold text-midnight-indigo">{review.name}</p>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-blue/60">
                        {review.subtext}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel / Pagination Dots */}
        <div className="mt-12 flex justify-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#006bff]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#006bff]/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#006bff]/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#006bff]/20" />
        </div>

      </div>
    </div>
  );
}
