import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { UserRole } from '@real-estate-erp/types';
import { PermissionService } from '../authorization/permissionService';
import { RoleResolver } from '../authorization/roleResolver';
import { useAuthContext } from './AuthContext';

export interface PermissionContextType {
  permissions: string[];
  role: UserRole | null;
  roleLevel: number;
  hasPermission: (permission: string) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasRole: (role: UserRole) => boolean;
  isAtLeastRole: (role: UserRole) => boolean;
  canManageRole: (targetRole: UserRole) => boolean;
}

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export interface PermissionProviderProps {
  children: ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
  const { user } = useAuthContext();

  const permissions = useMemo(() => {
    return PermissionService.resolveEffectivePermissions(user);
  }, [user]);

  const role = user?.role || null;
  const roleLevel = useMemo(() => (role ? RoleResolver.getRoleLevel(role) : 0), [role]);

  const value: PermissionContextType = {
    permissions,
    role,
    roleLevel,
    hasPermission: (perm: string) => PermissionService.can(user, perm),
    hasAllPermissions: (perms: string[]) => PermissionService.canAll(user, perms),
    hasAnyPermission: (perms: string[]) => PermissionService.canAny(user, perms),
    hasRole: (targetRole: UserRole) => role === targetRole,
    isAtLeastRole: (targetRole: UserRole) => (role ? RoleResolver.isRoleHigherOrEqual(role, targetRole) : false),
    canManageRole: (targetRole: UserRole) => (role ? RoleResolver.canManageRole(role, targetRole) : false),
  };

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
};

export const usePermissionContext = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissionContext must be used within a PermissionProvider');
  }
  return context;
};
