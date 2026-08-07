import { usePermissionContext } from '@real-estate-erp/firebase';

export function usePermissions() {
  const { permissions, hasPermission, hasAllPermissions, hasAnyPermission } =
    usePermissionContext();

  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    can: hasPermission,
    canAll: hasAllPermissions,
    canAny: hasAnyPermission,
  };
}
