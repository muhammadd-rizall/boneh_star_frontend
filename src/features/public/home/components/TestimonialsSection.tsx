import type { Review } from "@/features/admin/reviews/types/Review";
import { Star } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

interface TestimonialsSectionProps {
  reviews: Review[];
}

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const { ref, inView } = useInView(0.1);

  // Fallback reviews to match the image precisely
  const displayReviews = reviews && reviews.length > 0 ? reviews : [
    {
      id: "mock-1",
      rating: 5,
      comment: "Pelayanan sangat memuaskan, armada bersih dan nyaman. Perjalanan kami jadi lebih menyenangkan!",
      customer: { 
        name: "Rina Susanti",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"
      },
      booking: {
        activity: {
          name: "Wisata Keluarga"
        }
      }
    },
    {
      id: "mock-2",
      rating: 5,
      comment: "Tepat waktu, supir ramah, dan perjalanan terasa aman sampai tujuan. Recommended!",
      customer: { 
        name: "Andi Pratama",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
      },
      booking: {
        activity: {
          name: "Study Tour"
        }
      }
    },
    {
      id: "mock-3",
      rating: 5,
      comment: "Armada bagus, fasilitas lengkap. Pasti akan sewa lagi di kesempatan berikutnya.",
      customer: { 
        name: "Dewi Lestari",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop"
      },
      booking: {
        activity: {
          name: "Family Gathering"
        }
      }
    }
  ] as unknown as Review[];

  return (
    <div ref={ref} className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className={"mb-12 text-center flex flex-col items-center reveal " + (inView ? "in-view" : "")}>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-action-blue mb-3">
            TESTIMONI
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-midnight-indigo">
            Apa Kata Pelanggan Kami?
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {displayReviews.map((review, i) => {
            const customerAvatar = (review as any).customer?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop";
            
            return (
              <div
                key={review.id}
                className={"group flex flex-col reveal " + (inView ? "in-view" : "")}
                style={{ "--delay": (i * 100) + "ms" } as React.CSSProperties}
              >
                <div className="relative flex flex-col h-full rounded-[24px] bg-white p-8 border border-slate-100 transition-all duration-300 hover:shadow-card shadow-sm text-left">
                  
                  {/* Rating Stars on Top */}
                  <div className="mb-5 flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star 
                        key={idx} 
                        size={15} 
                        className={idx < review.rating ? "fill-sunset-gold text-sunset-gold" : "text-slate-200"} 
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <blockquote className="flex-1 text-sm font-medium leading-relaxed text-slate-blue/90 mb-8 italic">
                    "{review.comment}"
                  </blockquote>

                  {/* Customer Profile Block */}
                  <div className="flex items-center gap-3.5 pt-4 border-t border-slate-50">
                    <img 
                      src={customerAvatar} 
                      alt={review.customer?.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-100 shadow-sm"
                    />
                    <div>
                      <p className="text-sm font-bold text-midnight-indigo">{review.customer?.name || "Pelanggan Setia"}</p>
                      <p className="mt-0.5 text-[10px] font-bold text-slate-blue/60 uppercase tracking-wider">
                        {review.booking?.activity?.name || "Verified Customer"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel / Pagination Dots */}
        <div className="mt-10 flex justify-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-action-blue" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        </div>

      </div>
    </div>
  );
}
