import axios from '@/api/Axios';
import type { Role, RoleFormData, RoleApiResponse, Permission, RoleStatistics } from '../types/Role';

const ENDPOINTS = {
  BASE: '/admin/roles',
  DETAIL: (id: string) => `/admin/roles/${id}`,
  TRASHED: '/admin/roles/trashed',
  RESTORE: (id: string) => `/admin/roles/${id}/restore`,
  FORCE_DELETE: (id: string) => `/admin/roles/${id}/force-delete`,
  PERMISSIONS: '/admin/roles/permissions',
};

const groupPermissions = (permissions: Permission[]): Record<string, Permission[]> => {
  return permissions.reduce<Record<string, Permission[]>>((groups, permission) => {
    const groupName = permission.group || 'Other';
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(permission);
    return groups;
  }, {});
};

const normalizePermissions = (payload: unknown): Record<string, Permission[]> => {
  if (Array.isArray(payload)) {
    return groupPermissions(payload as Permission[]);
  }

  if (!payload || typeof payload !== 'object') {
    return {};
  }

  const candidate = payload as Record<string, unknown>;

  if (Array.isArray(candidate.permissions)) {
    return groupPermissions(candidate.permissions as Permission[]);
  }

  if (
    candidate.permissions &&
    typeof candidate.permissions === 'object' &&
    Object.values(candidate.permissions as Record<string, unknown>).every(Array.isArray)
  ) {
    return candidate.permissions as Record<string, Permission[]>;
  }

  if (Object.values(candidate).every(Array.isArray)) {
    return candidate as Record<string, Permission[]>;
  }

  return {};
};

export const roleService = {
  getAll: async (): Promise<{ roles: Role[]; statistic?: RoleStatistics }> => {
    const response = await axios.get<RoleApiResponse>(ENDPOINTS.BASE);
    return {
      roles: Array.isArray(response.data.data) ? (response.data.data as Role[]) : [],
      statistic: response.data.statistic || response.data.statistics,
    };
  },

  getActiveRoles: async (): Promise<Role[]> => {
    const response = await axios.get<RoleApiResponse>('/admin/roles/active');
    return Array.isArray(response.data.data) ? (response.data.data as Role[]) : [];
  },

  getById: async (id: string): Promise<Role> => {
    const response = await axios.get<RoleApiResponse>(ENDPOINTS.DETAIL(id));
    return response.data.data as Role;
  },

  create: async (data: RoleFormData): Promise<Role> => {
    const response = await axios.post<RoleApiResponse>(ENDPOINTS.BASE, data);
    return response.data.data as Role;
  },

  update: async (id: string, data: RoleFormData): Promise<Role> => {
    const response = await axios.put<RoleApiResponse>(ENDPOINTS.DETAIL(id), data);
    return response.data.data as Role;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(ENDPOINTS.DETAIL(id));
  },

  getPermissions: async (): Promise<Record<string, Permission[]>> => {
    const response = await axios.get<RoleApiResponse>(ENDPOINTS.PERMISSIONS);
    return normalizePermissions(
      response.data.data ?? (response.data as unknown as Record<string, unknown>).permissions ?? response.data
    );
  },

  syncPermissions: async (id: string, permissionIds: string[]): Promise<Role> => {
    const response = await axios.post<RoleApiResponse>(`${ENDPOINTS.BASE}/${id}/sync-permissions`, {
      permissions_ids: permissionIds
    });
    return response.data.data as Role;
  }
};

export default roleService;
