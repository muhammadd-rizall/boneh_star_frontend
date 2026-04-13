import type { BaseEntity, ActivableEntity, TimestampedEntity } from "@/types/Database";

export interface Permission extends BaseEntity {
  name: string;
  slug: string;
  group: string;
  created_at: string;
  updated_at: string;
}

export interface Role extends TimestampedEntity, ActivableEntity {
  name: string;
  slug: string;
  permissions?: Permission[];
}

export interface User extends TimestampedEntity, ActivableEntity {
  name: string;
  email: string;
  password?: string;
  roles: Role[];
  permission: Permission[];
}

export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  trashed: number;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role_ids: string[];
  is_active: boolean;
}

export interface UserApiResponse {
  success: boolean;
  message: string;
  statistics?: UserStatistics;
  data: User | User[];
}
