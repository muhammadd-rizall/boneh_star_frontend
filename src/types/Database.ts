/**
 * Base entity with UUID primary key
 * All entities support soft deletes via Laravel
 */
export interface BaseEntity {
  id: string
  deleted_at?: string | null
}

/**
 * Base entity with timestamps
 */
export interface TimestampedEntity extends BaseEntity {
  created_at: string
  updated_at?: string
}

/**
 * Base entity with active status
 */
export interface ActivableEntity {
  is_active: boolean
}

// ========================================
// RBAC (Role-Based Access Control)
// ========================================

/**
 * Roles Table
 * Defines user roles in the system
 */
export interface Role extends TimestampedEntity, ActivableEntity {
  name: string
  slug: string
  is_active: boolean
  users_count?: number
  permissions?: Permission[]
}

/**
 * Permissions Table
 * Defines granular permissions
 */
export interface Permission extends BaseEntity {
  name: string
  slug: string
  group: string
  created_at: string
  updated_at: string
}

/**
 * Role Has Permissions (Pivot Table)
 * Many-to-Many relationship between roles and permissions
 */
export interface RoleHasPermission {
  role_id: string
  permission_id: string
}

// ========================================
// USER MANAGEMENT
// ========================================

/**
 * Users Table
 * System users with role-based access
 */
export interface User extends TimestampedEntity, ActivableEntity {
  role_id: string
  name: string
  email: string
  password?: string
  is_active: boolean
  role?: Role
}

// ========================================
// Customer MANAGEMENT
// ========================================

/**
 * customer Table
 * System customer
 */
export interface Customer extends TimestampedEntity, ActivableEntity {
  name: string
  email: string
  phone: string
  password?: string
  profil_picture: string
  address: string
  is_active: boolean
}

// ========================================
// BUS MANAGEMENT
// ========================================

/**
 * Buses Table
 */
export interface Bus extends TimestampedEntity {
  bus_category_id: string;
  plat_number: string;
  name: string;
  seat_count: number;
  production_year: number;
  brand?: string | null;
  status: 'available' | 'booked' | 'maintenance' | 'inactive';
  notes?: string | null;
  category?: BusCategory;
  facilities?: BusFacility[];
  images?: BusImage[];
}

/**
 * Bus Categories Table
 */
export interface BusCategory extends TimestampedEntity {
  name: string
  min_capacity: number
  max_capacity: number
  description?: string | null
}

/**
 * Bus Facilities Table
 */
export interface BusFacility extends TimestampedEntity {
  name: string
}

/**
 * Activity Types Table
 */
export interface ActivityType extends TimestampedEntity {
  name: string
  description: string
}

/**
 * Route Types Table
 */
export interface RouteType extends TimestampedEntity {
  name: string
  scope: 'inside' | 'outside'
  description: string
}

/**
 * Drivers Table
 */
export interface Driver extends TimestampedEntity {
  name: string
  phone: string
  address: string
  photo?: string | null
  status: 'available' | 'on_duty' | 'inactive'
  notes?: string | null
}

/**
 * Bus Images Table
 */
export interface BusImage {
  id: string
  bus_id: string
  image_path: string
  url: string
  caption?: string | null
  is_primary: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ========================================
// BOOKING MANAGEMENT
// ========================================

/**
 * Booking Status Types
 */
export type BookingStatus = 'pending' | 'quoted' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';

/**
 * Cancelled By Types
 */
export type CancelledBy = 'customer' | 'admin';

/**
 * Bookings Table
 */
export interface Booking extends TimestampedEntity {
  customer_id: string;
  activity_id: string;
  route_type_id: string;
  booking_code: string;
  departure_date: string;
  return_date?: string | null;
  origin: string;
  full_route?: string | null;
  passenger_count: number;
  bus_count_requested: number;
  special_notes?: string | null;
  status: BookingStatus;
  cancelled_by?: CancelledBy | null;
  cancelled_reason?: string | null;
  
  // Relations (Matched with BookingResource)
  customer?: Customer;
  activity?: ActivityType;
  route_type?: RouteType;
  booking_buses?: BookingBus[];
}

/**
 * Booking Buses Table (Assignments)
 */
export interface BookingBus extends TimestampedEntity {
  booking_id: string;
  bus_id: string;
  driver_id: string;
  seat_count: number;
  assignment_notes?: string | null;

  // Relations
  bus?: Bus;
  driver?: Driver;
}

// ========================================
// QUOTATION MANAGEMENT
// ========================================

/**
 * Quotation Status Types
 */
export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'revision' | 'expired' | 'rejected';

/**
 * Quotations Table
 */
export interface Quotation extends TimestampedEntity {
  booking_id: string;
  user_id: string;
  proposed_price: number;
  dp_amount: number;
  note_to_customer: string;
  status: QuotationStatus;
  valid_until: string;
  revision_note?: string | null;

  // Relations
  booking?: Booking;
  user?: User;
}

// ========================================
// TRANSACTION MANAGEMENT
// ========================================

/**
 * Transaction Status Types
 */
export type TransactionStatus = 'waiting' | 'dp_paid' | 'fully_paid' | 'overdue';

/**
 * Transactions Table
 */
export interface Transaction extends TimestampedEntity {
  booking_id: string;
  quotation_id: string;
  invoice_number: string;
  total_amount: number;
  dp_paid: number;
  remaining_amount: number;
  status: TransactionStatus;

  // Relations
  booking?: Booking;
  quotation?: Quotation;
}
