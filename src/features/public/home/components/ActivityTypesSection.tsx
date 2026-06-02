import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType";
import { Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "@/hooks/useAnimations";
import { Button } from "@/components/ui/Button";

interface ActivityTypesSectionProps {
  activityTypes: ActivityType[];
}

export default function ActivityTypesSection({ activityTypes }: ActivityTypesSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { ref: sectionRef, inView } = useInView(0.1);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollTo = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("article")?.offsetWidth || 280;
    el.scrollBy({ left: dir === "left" ? -(cardWidth + 24) : cardWidth + 24, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (activityTypes.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        const cardWidth = el.querySelector("article")?.offsetWidth || 280;
        el.scrollBy({ left: cardWidth + 24, behavior: "smooth" });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [activityTypes.length, isPaused]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, activityTypes]);

  return (
    <section id="services" ref={sectionRef} className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      {/* Header */}
      <div className={"mb-16 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left reveal " + (inView ? "in-view" : "")}>
        <div className="flex flex-col items-center sm:items-start">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cloud-mist text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-6 shadow-sm">
            <Compass size={14} />
            Layanan Unggulan
          </span>
          <h2 className="text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight">
            Eksplorasi Tanpa Batas{" "}
            <br className="hidden sm:block" />
            <span className="text-action-blue">Untuk Setiap Momen.</span>
          </h2>
          <p className="mt-6 text-lg font-medium text-slate-blue leading-relaxed max-w-2xl">
            Solusi transportasi yang dipersonalisasi untuk memastikan setiap perjalanan Anda menjadi pengalaman tak terlupakan.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-3 sm:mt-0">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => scrollTo("left")} 
            disabled={!canScrollLeft} 
            className="rounded-xl shadow-sm"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => scrollTo("right")} 
            disabled={!canScrollRight} 
            className="rounded-xl shadow-sm"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        {canScrollLeft && <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />}
        {canScrollRight && <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />}

        <div ref={scrollRef} onScroll={checkScroll} className="flex gap-6 overflow-x-auto pb-8 pt-4 scroll-smooth snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {activityTypes.map((item, i) => (
            <article
              key={item.id}
              className={"group relative flex w-[320px] flex-shrink-0 snap-start flex-col p-8 rounded-xl bg-white border border-platinum-tint hover:border-action-blue hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 reveal " + (inView ? "in-view" : "")}
              style={{ "--delay": (i * 80) + "ms" } as React.CSSProperties}
            >
              <div className="flex-1">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-cloud-mist text-action-blue group-hover:bg-action-blue group-hover:text-white transition-all duration-300 shadow-sm">
                  <Compass size={24} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-midnight-indigo mb-4">{item.name}</h3>
                <p className="text-base font-medium leading-relaxed text-slate-blue opacity-80">{item.description || "Layanan transportasi prima untuk kenyamanan perjalanan rombongan Anda."}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
