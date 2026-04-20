import type { Notification as BaseNotification } from "@/types/Database";

export type Notification = BaseNotification;

export interface NotificationApiResponse {
  success: boolean;
  message: string;
  unread_count?: number;
  data: any; // Can be paginated or single notification
}
