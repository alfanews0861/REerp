import React, { ReactNode } from 'react';
import { usePermissionContext } from '@real-estate-erp/firebase';
import { UserRole } from '@real-estate-erp/types';

export interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  minRole?: UserRole;
  fallback?: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  minRole,
  fallback = null,
}) => {
  const { role, isAtLeastRole } = usePermissionContext();

  if (!role) {
    return <>{fallback}</>;
  }

  let isAllowed = true;

  if (allowedRoles && allowedRoles.length > 0) {
    isAllowed = allowedRoles.includes(role);
  }

  if (isAllowed && minRole) {
    isAllowed = isAtLeastRole(minRole);
  }

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
