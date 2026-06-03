import { useState, useEffect } from "react";
import { publicService } from "@/features/public/shared/services/publicService";
import type { Bus } from "@/features/admin/buses/types/Bus";
import type { BusCategory } from "@/features/admin/bus-categories/types/BusCategory";

export function useFleetData() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [categories, setCategories] = useState<BusCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [busData, catData] = await Promise.all([
          publicService.getBuses(),
          publicService.getBusCategories(),
        ]);
        setBuses(busData.filter((b) => b.status === "available"));
        setCategories(catData);
      } catch (err) {
        console.error("Failed to load fleet data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { buses, categories, loading };
}
