import { Search, MousePointerClick, CalendarCheck, Bus } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

export default function WorkingProcessSection() {
  const { ref, inView } = useInView(0.1);

  const steps = [
    { icon: Search, title: "Pencarian", desc: "Temukan armada bus" },
    { icon: MousePointerClick, title: "Pemilihan", desc: "Pilih sesuai kebutuhan" },
    { icon: CalendarCheck, title: "Pemesanan", desc: "Tentukan jadwal & rute" },
    { icon: Bus, title: "Perjalanan", desc: "Nikmati perjalanan Anda" },
  ];

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={"text-center mb-16 flex flex-col items-center reveal " + (inView ? "in-view" : "")}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cloud-mist text-glacier-blue text-[11px] font-bold uppercase tracking-wider border border-platinum-tint mb-6 shadow-sm">
            Cara Pesan
          </span>
          <h2 className="text-display-sm font-bold tracking-tight text-midnight-indigo leading-tight">
            Proses <span className="text-action-blue">Pemesanan.</span>
          </h2>
          <p className="mt-6 text-lg font-medium text-slate-blue max-w-2xl opacity-80">
            Empat langkah mudah untuk merencanakan perjalanan sempurna Anda bersama kami.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Dashed Line Background */}
          <div className="hidden md:block absolute top-[48px] left-[15%] right-[15%] border-t-[3px] border-dashed border-platinum-tint/80 z-0" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4">
            {steps.map((step, i) => (
              <div
                key={i}
                className={"flex flex-col items-center text-center reveal " + (inView ? "in-view" : "")}
                style={{ "--delay": i * 150 + "ms" } as React.CSSProperties}
              >
                {/* Icon Circle */}
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white text-action-blue mb-6 shadow-md border-[3px] border-cloud-mist transition-all duration-300 hover:scale-110 hover:border-action-blue hover:shadow-xl hover:text-glacier-blue">
                  <step.icon size={44} strokeWidth={1.5} />

                  {/* Number Badge */}
                  <div className="absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-midnight-indigo text-white text-[15px] font-black border-4 border-white shadow-sm">
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-[22px] font-bold text-midnight-indigo mb-2">{step.title}</h3>
                <p className="text-sm font-medium text-slate-blue max-w-[160px] opacity-80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
