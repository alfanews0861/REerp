import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext, usePermissionContext } from '@real-estate-erp/firebase';
import { LoadingFallback } from '../LoadingFallback';
import { AccessDenied } from './AccessDenied';

export interface PermissionRouteProps {
  children?: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  unauthorizedTo?: string;
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  unauthorizedTo,
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissionContext();

  if (isLoading) {
    return <LoadingFallback message="Validating permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  let isAllowed = true;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    isAllowed = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!isAllowed) {
    if (unauthorizedTo) {
      return <Navigate to={unauthorizedTo} replace />;
    }
    return <AccessDenied />;
  }

  return <>{children ? children : <Outlet />}</>;
};
