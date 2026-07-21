import { Calendar, Bus, ClipboardCheck, ShieldCheck } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

const steps = [
  {
    id: 1,
    icon: Calendar,
    title: "Pilih Tanggal & Tujuan",
    desc: "Tentukan tanggal keberangkatan dan tujuan perjalanan Anda."
  },
  {
    id: 2,
    icon: Bus,
    title: "Pilih Armada",
    desc: "Pilih armada yang sesuai dengan kebutuhan rombongan Anda."
  },
  {
    id: 3,
    icon: ClipboardCheck,
    title: "Isi Data Pemesanan",
    desc: "Lengkapi data pemesanan dan detail perjalanan."
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Konfirmasi & Berangkat",
    desc: "Pemesanan dikonfirmasi, siap berangkat sesuai jadwal."
  }
];

export default function WorkingProcessSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="py-24 bg-white scroll-mt-24" id="cara-pemesanan">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className={`text-center flex flex-col items-center mb-20 reveal ${inView ? "in-view" : ""}`}>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#006bff] mb-3 block">
            CARA PEMESANAN
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-midnight-indigo leading-tight">
            Mudah, Cepat & Praktis
          </h2>
        </div>

        {/* Timeline container */}
        <div className={`relative reveal ${inView ? "in-view" : ""}`}>
          
          {/* Connecting Dashed Line on Desktop */}
          <div className="hidden lg:block absolute top-10 left-[15%] right-[15%] border-t-2 border-dashed border-slate-200/80 z-0" />

          {/* Steps Grid */}
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center group px-4">
                  
                  {/* Icon Container with Badge */}
                  <div className="relative mb-6">
                    {/* Number Badge */}
                    <div className="absolute -top-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#006bff] text-[11px] font-extrabold text-white shadow-sm z-20">
                      {step.id}
                    </div>
                    
                    {/* Circle Icon */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#006bff] border border-slate-100 shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#006bff]/20 group-hover:shadow-[0_12px_24px_rgba(0,107,255,0.08)]">
                      <Icon size={32} className="stroke-[1.8] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-midnight-indigo mb-2.5 group-hover:text-[#006bff] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-[13px] font-medium leading-relaxed text-slate-blue/70 max-w-[220px]">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
