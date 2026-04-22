import type { ActivityType as BaseActivityType } from "@/types/Database";

export type ActivityType = BaseActivityType;

export interface ActivityTypeStatistics {
  total: number;
  trashed: number;
}

export interface ActivityTypeFormData {
  name: string;
  description?: string;
}

export interface ActivityTypeApiResponse {
  success: boolean;
  message: string;
  statistic?: ActivityTypeStatistics;
  data: ActivityType | ActivityType[] | { data: ActivityType[] };
}
