import { useState, useCallback, useEffect } from "react";
import { roleService } from "../services/RoleService";
import type { Role, Permission } from "../types/Role";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roleService.getAll();
      setRoles(data);
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
    permissions,
    loading,
    error,
    refetch: fetchRoles,
    deleteRole
  };
}
