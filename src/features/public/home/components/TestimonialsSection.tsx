import type { Review } from "@/features/admin/reviews/types/Review";
import { Star, MessageSquare, Quote } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

interface TestimonialsSectionProps {
  reviews: Review[];
}

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  const { ref, inView } = useInView(0.1);

  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" ref={ref} className="py-24 bg-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={"mb-16 text-center flex flex-col items-center reveal " + (inView ? "in-view" : "")}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-6 shadow-sm">
            <MessageSquare size={14} />
            Suara Pelanggan
          </span>
          <h2 className="text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight">
            Apa Kata Mereka{" "}
            <br className="hidden sm:block" />
            <span className="text-action-blue">Tentang Layanan Kami.</span>
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className={"group flex flex-col reveal " + (inView ? "in-view" : "")}
              style={{ "--delay": (i * 100) + "ms" } as React.CSSProperties}
            >
              <div className="relative flex flex-col rounded-xl bg-white p-8 transition-all duration-500 hover:shadow-card hover:-translate-y-2 border border-platinum-tint hover:border-action-blue/30 shadow-sm">
                <Quote size={24} className="text-action-blue/10 mb-6 group-hover:text-action-blue/20 transition-colors" />
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={14} className={idx < review.rating ? "fill-sunset-gold text-sunset-gold" : "text-platinum-tint"} />
                  ))}
                </div>
                <blockquote className="flex-1 text-base font-medium leading-relaxed text-midnight-indigo/80 italic">
                  "{review.comment || "Layanan sangat memuaskan, armada bersih dan driver sangat profesional."}"
                </blockquote>
                <div className="mt-8 flex items-center gap-4 pt-6 border-t border-platinum-tint/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cloud-mist border border-platinum-tint text-sm font-bold text-action-blue shadow-sm">
                    {review.customer?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="text-base font-bold text-midnight-indigo">{review.customer?.name || "Pelanggan Setia"}</p>
                    <p className="mt-0.5 text-xs font-bold text-slate-blue uppercase tracking-wider opacity-60">{review.booking?.activity?.name || "Verified Customer"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
