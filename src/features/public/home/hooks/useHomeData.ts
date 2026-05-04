import { useState, useEffect, useCallback } from "react";
import { busService } from "@/features/admin/buses/services/BusService";
import { bookingService } from "@/features/admin/bookings/services/BookingService";
import { routeTypeService } from "@/features/admin/route-types/services/RouteTypeService";
import { activityTypeService } from "@/features/admin/activity-types/services/ActivityTypeService";
import { reviewService } from "@/features/admin/reviews/services/ReviewService";
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
      
      const [busRes, bookingRes, routeRes, activityRes, reviewRes] = await Promise.all([
        busService.getAll(),
        bookingService.getAll(),
        routeTypeService.getAll(),
        activityTypeService.getAll(),
        reviewService.getReport({ per_page: 6 }), // Fetch latest reviews
      ]);

      // Filter featured buses (available + has images)
      const featured = busRes.buses
        .filter(b => b.status === 'available' && b.images && b.images.length > 0)
        .slice(0, 4);

      // Extract statistics
      const totalBuses = busRes.statistics?.cards.total || busRes.buses.length;
      const completedBookings = bookingRes.statistics?.by_status.completed || 0;
      const totalRoutes = routeRes.routeTypes.length;

      setData({
        stats: {
          buses: totalBuses,
          bookings: completedBookings,
          routes: totalRoutes,
          founded: 2018, // Default value
        },
        activityTypes: activityRes.activityTypes,
        featuredBuses: featured,
        reviews: reviewRes.reviews.data || [],
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
