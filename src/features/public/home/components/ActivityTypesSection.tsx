import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType";
import { ArrowRight } from "lucide-react";

interface ActivityTypesSectionProps {
  activityTypes: ActivityType[];
}

export default function ActivityTypesSection({ activityTypes }: ActivityTypesSectionProps) {
  return (
    <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-16">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600 mb-4">Layanan Eksklusif</p>
        <h2 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl leading-tight">
          Solusi Transportasi untuk <br />
          <span className="text-slate-400">Berbagai Kebutuhan Perjalanan.</span>
        </h2>
      </div>

      <div className="grid gap-px bg-slate-100 overflow-hidden rounded-[32px] border border-slate-100 sm:grid-cols-2 lg:grid-cols-4">
        {activityTypes.map((item) => (
          <article
            key={item.id}
            className="group relative flex flex-col bg-white p-10 transition-all hover:bg-slate-50"
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                {item.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                {item.description || "Layanan transportasi prima untuk kenyamanan perjalanan rombongan Anda."}
              </p>
            </div>
            
            <div className="mt-10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-orange-200 transition-colors">
                Service 0{activityTypes.indexOf(item) + 1}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all group-hover:bg-orange-600 group-hover:text-white group-hover:rotate-[-45deg]">
                <ArrowRight size={18} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
