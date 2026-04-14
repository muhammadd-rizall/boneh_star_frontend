import { useState, useCallback, useEffect } from "react";
import { roleService } from "../services/RoleService";
import type { Role, Permission, RoleStatistics } from "../types/Role";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [statistics, setStatistics] = useState<RoleStatistics | null>(null);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { roles, statistic } = await roleService.getAll();
      setRoles(roles);
      if (statistic) setStatistics(statistic);
    } catch (err: any) {
      setError(err.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const data = await roleService.getPermissions();
      setPermissions(data);
    } catch (err: any) {
      console.error("Failed to fetch permissions:", err);
    }
  }, []);

  const deleteRole = async (id: string) => {
    try {
      await roleService.delete(id);
      await fetchRoles();
    } catch (err: any) {
      setError(err.message || "Failed to delete role");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  return {
    roles,
    statistics,
    permissions,
    loading,
    error,
    refetch: fetchRoles,
    deleteRole
  };
}
