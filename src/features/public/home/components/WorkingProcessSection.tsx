import { Calendar, FileText, UserCheck, CreditCard, Bus } from "lucide-react";
import { useInView } from "@/hooks/useAnimations";

const steps = [
  { 
    id: "01",
    icon: Calendar, 
    title: "Cek Ketersediaan", 
    desc: "Pilih tanggal dan armada yang sesuai kebutuhan Anda" 
  },
  { 
    id: "02",
    icon: FileText, 
    title: "Isi Formulir", 
    desc: "Lengkapi data perjalanan secara mudah" 
  },
  { 
    id: "03",
    icon: UserCheck, 
    title: "Konfirmasi Admin", 
    desc: "Tim kami akan menghubungi untuk konfirmasi" 
  },
  { 
    id: "04",
    icon: CreditCard, 
    title: "Pembayaran", 
    desc: "Lakukan pembayaran sesuai kesepakatan" 
  },
  { 
    id: "05",
    icon: Bus, 
    title: "Berangkat", 
    desc: "Perjalanan nyaman siap dimulai" 
  }
];

export default function WorkingProcessSection() {
  const { ref, inView } = useInView(0.1);

  return (
    <section ref={ref} className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Soft Container Card */}
        <div className={`bg-[#FAF9F6]/50 rounded-[32px] border border-slate-100 p-8 sm:p-12 relative overflow-hidden reveal ${
          inView ? "in-view" : ""
        }`}>
          
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Header Info (3 cols) */}
            <div className="lg:col-span-3 text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-action-blue block mb-3">
                ALUR PEMESANAN
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-midnight-indigo leading-tight">
                Mudah, Cepat <br className="hidden sm:block" />& Praktis
              </h2>
            </div>

            {/* Right Steps Timeline (9 cols) */}
            <div className="lg:col-span-9 relative">
              
              {/* Dashed Line on Desktop */}
              <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] border-t-2 border-dashed border-slate-200 z-0" />

              {/* Steps Wrapper */}
              <div className="relative z-10 grid gap-8 sm:grid-cols-5">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} className="flex flex-col items-center text-center group">
                      
                      {/* Circle Icon Container */}
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-action-blue mb-4 shadow-sm border border-slate-100 transition-all duration-300 group-hover:scale-105 group-hover:border-action-blue/30 group-hover:shadow-md">
                        <Icon size={26} strokeWidth={1.5} className="group-hover:scale-110 transition-transform duration-300" />
                      </div>

                      {/* Step Number */}
                      <span className="text-xs font-extrabold text-action-blue/80 tracking-wider mb-2 block">
                        {step.id}
                      </span>

                      {/* Titles & Desc */}
                      <h4 className="text-sm font-bold text-midnight-indigo mb-1.5 px-1 leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-blue/70 leading-relaxed max-w-[140px] px-2">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
