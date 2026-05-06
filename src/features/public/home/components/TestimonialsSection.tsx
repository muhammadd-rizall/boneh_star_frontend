import type { Review } from "@/features/admin/reviews/types/Review";
import { Star, MessageSquare } from "lucide-react";

interface TestimonialsSectionProps {
  reviews: Review[];
}

export default function TestimonialsSection({ reviews }: TestimonialsSectionProps) {
  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 mb-6">
            <MessageSquare size={14} />
            Suara Pelanggan
          </span>
          <h2 className="text-5xl font-black tracking-tighter text-slate-950 md:text-6xl leading-[1.1]">
            Apa Kata Mereka <br />
            <span className="text-orange-500 italic">Tentang Layanan Kami.</span>
          </h2>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="relative flex flex-col rounded-[2.5rem] bg-slate-50 p-10 transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-orange-100/50 border border-transparent hover:border-slate-50">
                <div className="mb-8 flex gap-1.5">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      size={14}
                      className={idx < review.rating ? "fill-orange-400 text-orange-400" : "text-slate-200"}
                    />
                  ))}
                </div>

                <blockquote className="flex-1 text-sm font-bold leading-relaxed text-slate-600 italic">
                  "{review.comment || "Layanan sangat memuaskan, armada bersih dan driver sangat profesional."}"
                </blockquote>

                <div className="mt-10 flex items-center gap-4 pt-8 border-t border-slate-200/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 text-xs font-black text-slate-900 group-hover:bg-slate-950 group-hover:text-white transition-all duration-500">
                    {review.customer?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950">{review.customer?.name || "Pelanggan Setia"}</p>
                    <p className="mt-0.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
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
