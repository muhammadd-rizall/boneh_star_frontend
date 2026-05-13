import { useState, useEffect, useCallback } from 'react';
import { publicService } from '@/features/public/shared/services/publicService';
import type { Bus } from '@/features/admin/buses/types/Bus';
import type { ActivityType } from '@/features/admin/activity-types/types/ActivityType';
import type { Review } from '@/features/admin/reviews/types/Review';
import type { BusCategory } from '@/features/admin/bus-categories/types/BusCategory';

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
    allBuses: Bus[];
    categories: BusCategory[];
    reviews: Review[];
    loading: boolean;
    error: string | null;
  }>({
    stats: { buses: 0, bookings: 0, routes: 0, founded: 2018 },
    activityTypes: [],
    featuredBuses: [],
    allBuses: [],
    categories: [],
    reviews: [],
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      const [busPage, routeRes, activityRes, reviewPage, categoryRes] = await Promise.all([
        publicService.getBusesPaginated({ per_page: 100 }),
        publicService.getRouteTypes(),
        publicService.getActivityTypes(),
        publicService.getReviewsPaginated({ per_page: 6 }),
        publicService.getBusCategories(),
      ]);
      const busRes = busPage.data;
      const reviewRes = reviewPage.data;
      const featured = busRes.filter((b: Bus) => b.status === 'available' && b.images && b.images.length > 0).slice(0, 4);
      const totalBuses = busPage.meta?.total || busRes.length;
      const totalRoutes = routeRes.length;
      const totalBookings = reviewPage.meta?.total || reviewRes.length;
      setData({
        stats: {
          buses: totalBuses,
          bookings: totalBookings,
          routes: totalRoutes,
          founded: 2018,
        },
        activityTypes: activityRes,
        featuredBuses: featured,
        allBuses: busRes,
        categories: categoryRes,
        reviews: reviewRes,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      console.error('Home Data Error:', err);
      setData((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return data;
}
