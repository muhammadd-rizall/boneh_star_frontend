import { Bus as BusIcon } from "lucide-react";
import { resolveMediaUrl } from "@/features/admin/company-profile/utils/companyProfileUtils";
import type { Bus } from "@/features/admin/buses/types/Bus";
import { cn } from "@/lib/utils";
import { getBusStatusMeta, getCapacityLabel } from "../utils/fleetCardUtils";

export interface FleetCardProps {
  bus: Bus;
  index?: number;
  inView?: boolean;
  className?: string;
}

export default function FleetCard({
  bus,
  index = 0,
  inView = true,
  className,
}: FleetCardProps) {
  const primaryImage = bus.images?.find((img) => img.is_primary) || bus.images?.[0];
  const imageUrl = resolveMediaUrl(primaryImage?.url);
  const facilities = bus.facilities ?? [];

  const status = getBusStatusMeta(bus.status);
  const capacityLabel = getCapacityLabel(bus);

  const detailParts = [
    capacityLabel,
    bus.production_year ? `Tahun ${bus.production_year}` : null,
    bus.plat_number ? bus.plat_number : null,
  ].filter(Boolean);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[24px] border border-platinum-tint bg-white reveal",
        "transition-all duration-300 hover:border-action-blue/25 hover:shadow-card hover:-translate-y-1",
        inView && "in-view",
        className
      )}
      style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
    >
      <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-cloud-mist">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={bus.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-blue/30">
            <BusIcon size={40} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-slate-blue">
            {bus.category?.name || "Armada"}
          </span>
          <span className={cn("text-sm font-medium", status.textClass)}>
            {status.label}
          </span>
        </div>

        <h3 className="text-xl font-bold leading-snug text-midnight-indigo transition-colors group-hover:text-action-blue line-clamp-2">
          {bus.name}
        </h3>

        {bus.brand && (
          <p className="mt-1.5 text-sm leading-relaxed text-slate-blue">{bus.brand}</p>
        )}

        {detailParts.length > 0 && (
          <p className="mt-4 text-sm leading-relaxed text-slate-blue">
            {detailParts.join(" · ")}
          </p>
        )}

        {facilities.length > 0 && (
          <p className="mt-4 border-t border-platinum-tint/80 pt-4 text-sm leading-relaxed text-slate-blue line-clamp-3">
            {facilities.map((f) => f.name).join(" · ")}
          </p>
        )}

        {bus.notes?.trim() && !facilities.length && (
          <p className="mt-4 border-t border-platinum-tint/80 pt-4 text-sm leading-relaxed text-slate-blue line-clamp-2">
            {bus.notes.trim()}
          </p>
        )}
      </div>
    </article>
  );
}
