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
  users_count?: number;
}

export interface RoleFormData {
  name: string;
  slug: string;
  is_active: boolean;
  permissions_ids?: string[];
}

export interface RoleStatistics {
  total_roles: number;
  active_roles: number;
  inactive_roles: number;
  total_permissions: number;
}

export interface RoleApiResponse {
  success: boolean;
  message: string;
  data: Role | Role[] | Record<string, Permission[]>;
  statistic?: RoleStatistics;
}
