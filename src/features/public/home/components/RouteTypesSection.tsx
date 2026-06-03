import { Map, MapPin } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

export default function RouteTypesSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="relative z-20 -mt-12 sm:-mt-20 mb-16 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-platinum-tint overflow-hidden">
          
          <div className={"flex flex-col sm:flex-row items-center text-center sm:text-left p-8 sm:p-10 hover:bg-cloud-mist/50 transition-colors reveal " + (inView ? "in-view" : "")}>
            <div className="mb-4 sm:mb-0 sm:mr-6 flex shrink-0 h-20 w-20 items-center justify-center rounded-full bg-action-blue/10 text-action-blue shadow-sm transition-transform duration-300 hover:scale-110">
              <MapPin size={36} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-midnight-indigo mb-2">
                Rute Dalam Kota
              </h3>
              <p className="text-slate-blue text-sm leading-relaxed">
                Transportasi fleksibel untuk mobilitas dalam kota Anda.
              </p>
            </div>
          </div>

          <div className={"flex flex-col sm:flex-row items-center text-center sm:text-left p-8 sm:p-10 sm:border-l border-t sm:border-t-0 border-platinum-tint hover:bg-cloud-mist/50 transition-colors reveal " + (inView ? "in-view" : "")} style={{ "--delay": "150ms" } as React.CSSProperties}>
            <div className="mb-4 sm:mb-0 sm:mr-6 flex shrink-0 h-20 w-20 items-center justify-center rounded-full bg-action-blue/10 text-action-blue shadow-sm transition-transform duration-300 hover:scale-110">
              <Map size={36} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-midnight-indigo mb-2">
                Rute Luar Kota
              </h3>
              <p className="text-slate-blue text-sm leading-relaxed">
                Perjalanan antar kota yang aman dan sangat nyaman.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
