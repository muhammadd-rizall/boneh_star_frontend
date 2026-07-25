import { useAuthStore } from "@/store/useAuthStore";

/**
 * Global hook for fine-grained module permissions (RBAC)
 * @param moduleName - Name of the module domain (e.g., 'buses', 'users', 'roles', 'bookings')
 */
export function useModulePermission(moduleName: string) {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  return {
    canView: hasPermission(`${moduleName}.view`),
    canCreate: hasPermission(`${moduleName}.create`),
    canUpdate: hasPermission(`${moduleName}.update`),
    canDelete: hasPermission(`${moduleName}.delete`),
    canRestore: hasPermission(`${moduleName}.restore`) || hasPermission(`${moduleName}.update`),
    canForceDelete: hasPermission(`${moduleName}.forceDelete`) || hasPermission(`${moduleName}.delete`),
    canVerify: hasPermission(`${moduleName}.verify`),
    canPublish: hasPermission(`${moduleName}.publish`),
    hasPermission,
  };
}

export default useModulePermission;
