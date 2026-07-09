import { useState, useEffect } from 'react';
import { publicService } from '../services/publicService';
import type { CompanyProfile } from '@/features/admin/company-profile/types/CompanyProfile';
import type { Bus } from '@/features/admin/buses/types/Bus';
import type { BusFacility } from '@/features/admin/bus-facilities/types/BusFacility';
import type { Review } from '@/features/admin/reviews/types/Review';
import type { ActivityType } from '@/features/admin/activity-types/types/ActivityType';
import type { RouteType } from '@/features/admin/route-types/types/RouteType';

export function usePublicData() {
  const [data, setData] = useState<{
    profile: CompanyProfile | null;
    buses: Bus[];
    facilities: BusFacility[];
    reviews: Review[];
    activityTypes: ActivityType[];
    routeTypes: RouteType[];
  }>({
    profile: null,
    buses: [],
    facilities: [],
    reviews: [],
    activityTypes: [],
    routeTypes: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profile, buses, facilities, reviews, activityTypes, routeTypes] = await Promise.all([
          publicService.getCompanyProfile(),
          publicService.getBuses(),
          publicService.getFacilities(),
          publicService.getReviews(),
          publicService.getActivityTypes(),
          publicService.getRouteTypes(),
        ]);
        setData({
          profile,
          buses,
          facilities,
          reviews,
          activityTypes: activityTypes.filter(a => !a.deleted_at),
          routeTypes: routeTypes.filter(r => !r.deleted_at),
        });
      } catch (err) {
        console.error("Gagal memuat data publik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { ...data, loading };
}
