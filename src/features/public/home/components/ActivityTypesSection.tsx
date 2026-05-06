import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType";
import { ArrowRight, Compass } from "lucide-react";

interface ActivityTypesSectionProps {
  activityTypes: ActivityType[];
}

export default function ActivityTypesSection({ activityTypes }: ActivityTypesSectionProps) {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mb-20 text-center flex flex-col items-center">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-100 mb-6">
          <Compass size={14} />
          Layanan Unggulan
        </span>
        <h2 className="text-5xl font-black tracking-tighter text-slate-950 md:text-6xl leading-[1.1]">
          Eksplorasi Tanpa Batas <br />
          <span className="text-orange-500">Untuk Setiap Momen.</span>
        </h2>
        <p className="mt-8 text-lg font-medium text-slate-500 leading-relaxed max-w-2xl">
          Kami menyediakan solusi transportasi yang dipersonalisasi untuk memastikan setiap perjalanan Anda menjadi pengalaman yang tak terlupakan.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {activityTypes.map((item, i) => (
          <article
            key={item.id}
            className="group relative flex flex-col p-10 rounded-[3rem] bg-white border border-slate-50 shadow-sm shadow-slate-100 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex-1">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                <Compass size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-black tracking-tight text-slate-950 mb-4 group-hover:text-orange-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-sm font-semibold leading-relaxed text-slate-400">
                {item.description || "Layanan transportasi prima untuk kenyamanan perjalanan rombongan Anda."}
              </p>
            </div>
            
            <div className="mt-12 flex items-center justify-between border-t border-slate-50 pt-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                #{String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-slate-950 group-hover:text-white group-hover:rotate-[-45deg]">
                <ArrowRight size={18} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
