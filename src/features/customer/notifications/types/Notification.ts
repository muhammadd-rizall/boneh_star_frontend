export interface CustomerNotification {
  id: string;
  target_type: string;
  target_id: string;
  title: string;
  message: string;
  type: string;
  reference_type: string;
  reference_id: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface NotificationApiResponse {
  success: boolean;
  unread_count: number;
  data: {
    data: CustomerNotification[];
    meta: any;
  };
  message: string;
}
