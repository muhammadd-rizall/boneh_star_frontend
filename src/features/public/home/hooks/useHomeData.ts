import { useState, useEffect, useCallback } from "react";
import { publicService } from "@/features/public/services/publicService";
import type { Bus } from "@/features/admin/buses/types/Bus";
import type { ActivityType } from "@/features/admin/activity-types/types/ActivityType";
import type { Review } from "@/features/admin/reviews/types/Review";

export function useHomeData() {
  const [data, setData] = useState<{
    stats: {
      buses: number;
      bookings: number;
      routes: number;
      founded: number;
    };
    activityTypes: ActivityType[];
    featuredBuses: Bus[];
    reviews: Review[];
    loading: boolean;
    error: string | null;
  }>({
    stats: { buses: 0, bookings: 0, routes: 0, founded: 2018 },
    activityTypes: [],
    featuredBuses: [],
    reviews: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      
      const [busRes, routeRes, activityRes, reviewRes] = await Promise.all([
        publicService.getBuses(),
        publicService.getRouteTypes(),
        publicService.getActivityTypes(),
        publicService.getReviews({ per_page: 6 }),
      ]);

      // Filter featured buses (available + has images)
      const featured = busRes
        .filter((b: Bus) => b.status === 'available' && b.images && b.images.length > 0)
        .slice(0, 4);

      // Extract statistics
      const totalBuses = busRes.length;
      const totalRoutes = routeRes.length;
      const completedBookings = reviewRes.length;

      setData({
        stats: {
          buses: totalBuses,
          bookings: completedBookings,
          routes: totalRoutes,
          founded: 2018, // Default value
        },
        activityTypes: activityRes,
        featuredBuses: featured,
        reviews: reviewRes,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error("Home Data Error:", err);
      setData((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return data;
}
