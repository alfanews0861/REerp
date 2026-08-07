import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext, usePermissionContext } from '@real-estate-erp/firebase';
import { UserRole } from '@real-estate-erp/types';
import { LoadingFallback } from '../LoadingFallback';
import { AccessDenied } from './AccessDenied';

export interface RoleRouteProps {
  children?: ReactNode;
  allowedRoles?: UserRole[];
  minRole?: UserRole;
  unauthorizedTo?: string;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({
  children,
  allowedRoles,
  minRole,
  unauthorizedTo,
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { role, isAtLeastRole } = usePermissionContext();

  if (isLoading) {
    return <LoadingFallback message="Validating user roles..." />;
  }

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />;
  }

  let isAllowed = true;

  if (allowedRoles && allowedRoles.length > 0) {
    isAllowed = allowedRoles.includes(role);
  }

  if (isAllowed && minRole) {
    isAllowed = isAtLeastRole(minRole);
  }

  if (!isAllowed) {
    if (unauthorizedTo) {
      return <Navigate to={unauthorizedTo} replace />;
    }
    return <AccessDenied />;
  }

  return <>{children ? children : <Outlet />}</>;
};
