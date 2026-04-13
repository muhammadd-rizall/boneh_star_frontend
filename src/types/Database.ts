
/**
 * Base entity with UUID primary key
 * All entities support soft deletes via Laravel
 */
export interface BaseEntity {
  id: string;
  deleted_at?: string | null;
}

/**
 * Base entity with timestamps
 */
export interface TimestampedEntity extends BaseEntity {
  created_at: string;
  updated_at?: string;
}

/**
 * Base entity with active status
 */
export interface ActivableEntity {
  is_active: boolean;
}


// ========================================
// RBAC (Role-Based Access Control)
// ========================================

/**
 * Roles Table
 * Defines user roles in the system
 */
export interface Role extends TimestampedEntity, ActivableEntity {
  name: string;
  slug: string;
  is_active: boolean;
  users_count?: number;
  permissions?: Permission[];
}

/**
 * Permissions Table
 * Defines granular permissions
 */
export interface Permission extends BaseEntity {
  name: string;
  slug: string;
  group: string;
  created_at: string;
  updated_at: string;
}

/**
 * Role Has Permissions (Pivot Table)
 * Many-to-Many relationship between roles and permissions
 */
export interface RoleHasPermission {
  role_id: string;
  permission_id: string;
}

// ========================================
// USER MANAGEMENT
// ========================================

/**
 * Users Table
 * System users with role-based access
 */
export interface User extends TimestampedEntity, ActivableEntity {
  role_id: string;
  name: string;
  email: string;
  password?: string;
  is_active: boolean;
  role?: Role;
}

