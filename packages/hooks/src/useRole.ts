import { usePermissionContext } from '@real-estate-erp/firebase';

export function useRole() {
  const { role, roleLevel, hasRole, isAtLeastRole, canManageRole } =
    usePermissionContext();

  return {
    role,
    roleLevel,
    hasRole,
    isAtLeastRole,
    canManageRole,
    isSuperAdmin: role === 'super_admin',
    isDirector: role === 'director',
    isBranchManager: role === 'branch_manager',
    isSalesManager: role === 'sales_manager',
    isAccountant: role === 'accountant',
  };
}
