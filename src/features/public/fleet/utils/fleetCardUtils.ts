import type { Bus } from "@/features/admin/buses/types/Bus";

export function getBusStatusMeta(status: Bus["status"]) {
  switch (status) {
    case "available":
      return { label: "Tersedia", textClass: "text-emerald-700", dotClass: "bg-emerald-500" };
    case "booked":
      return { label: "Beroperasi", textClass: "text-amber-700", dotClass: "bg-amber-500" };
    case "maintenance":
      return { label: "Perawatan", textClass: "text-slate-blue", dotClass: "bg-slate-400" };
    default:
      return { label: "Nonaktif", textClass: "text-slate-blue", dotClass: "bg-slate-400" };
  }
}

export function getCapacityLabel(bus: Bus): string {
  const seats = bus.seat_count;
  const category = bus.category;

  if (category?.min_capacity && category?.max_capacity) {
    if (category.min_capacity === category.max_capacity) {
      return `${seats} kursi`;
    }
    return `${category.min_capacity}–${category.max_capacity} kursi`;
  }

  return `${seats} kursi`;
}
