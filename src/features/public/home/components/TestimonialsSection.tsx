import type { Review } from "@/features/admin/reviews/types/Review";
import { Star } from "lucide-react";

interface TestimonialsSectionProps {
  reviews: Review[];
}

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 flex flex-col items-center text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600 mb-4">Testimoni Pelanggan</p>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
            Cerita Perjalanan Mereka.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group relative flex flex-col rounded-[32px] bg-white p-8 transition-all hover:shadow-2xl hover:shadow-slate-200"
            >
              <div className="mb-6 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < review.rating ? "fill-orange-500 text-orange-500" : "text-slate-100"}
                  />
                ))}
              </div>

              <blockquote className="flex-1 text-sm font-medium leading-relaxed text-slate-600">
                "{review.comment || "Layanan sangat memuaskan, armada bersih dan driver sangat profesional. Sangat direkomendasikan untuk perjalanan rombongan."}"
              </blockquote>

              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                  {review.customer?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{review.customer?.name || "Pelanggan Setia"}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {review.booking?.activity?.name || "Perjalanan Wisata"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
