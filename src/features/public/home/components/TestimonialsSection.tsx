import type { Review } from "@/features/admin/reviews/types/Review";
import { Star, MessageSquare, Quote } from "lucide-react";

interface TestimonialsSectionProps {
  reviews: Review[];
}

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[11px] font-semibold uppercase tracking-wider border border-orange-100 mb-5">
            <MessageSquare size={13} />
            Suara Pelanggan
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight">
            Apa Kata Mereka{" "}
            <br className="hidden sm:block" />
            <span className="text-orange-500">Tentang Layanan Kami.</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="relative flex flex-col rounded-2xl bg-slate-50/70 p-7 transition-all duration-400 hover:bg-white hover:shadow-lg hover:shadow-slate-100 border border-transparent hover:border-slate-100">
                {/* Quote Icon */}
                <Quote size={20} className="text-orange-200 mb-5" />

                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={13}
                      className={idx < review.rating ? "fill-orange-400 text-orange-400" : "text-slate-200"}
                    />
                  ))}
                </div>

                {/* Comment */}
                <blockquote className="flex-1 text-sm font-medium leading-relaxed text-slate-600">
                  "{review.comment || "Layanan sangat memuaskan, armada bersih dan driver sangat profesional."}"
                </blockquote>

                {/* Author */}
                <div className="mt-7 flex items-center gap-3 pt-6 border-t border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100 text-xs font-bold text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                    {review.customer?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{review.customer?.name || "Pelanggan Setia"}</p>
                    <p className="mt-0.5 text-xs font-medium text-slate-400">
                      {review.booking?.activity?.name || "Verified Customer"}
                    </p>
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
