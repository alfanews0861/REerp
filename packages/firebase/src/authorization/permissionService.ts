import { UserProfile, UserRole } from '@real-estate-erp/types';
import { PERMISSION_MATRIX } from './permissionMatrix';
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
} from './permissionResolver';
import { PermissionCache } from './permissionCache';

export class PermissionService {
  public static getPermissionsForRole(role: UserRole): string[] {
    return PERMISSION_MATRIX[role] || [];
  }

  public static resolveEffectivePermissions(user: UserProfile | null): string[] {
    if (!user) return [];

    const rolePerms = this.getPermissionsForRole(user.role);
    const customPerms = user.permissions || [];

    const combined = new Set<string>([...rolePerms, ...customPerms]);
    return Array.from(combined);
  }

  public static can(user: UserProfile | null, requiredPermission: string): boolean {
    if (!user) return false;

    const effectivePerms = this.resolveEffectivePermissions(user);

    const cached = PermissionCache.get(effectivePerms, requiredPermission);
    if (cached !== null) return cached;

    const result = hasPermission(effectivePerms, requiredPermission);
    PermissionCache.set(effectivePerms, requiredPermission, result);
    return result;
  }

  public static canAll(user: UserProfile | null, requiredPermissions: string[]): boolean {
    if (!user) return false;
    const effectivePerms = this.resolveEffectivePermissions(user);
    return hasAllPermissions(effectivePerms, requiredPermissions);
  }

  public static canAny(user: UserProfile | null, requiredPermissions: string[]): boolean {
    if (!user) return false;
    const effectivePerms = this.resolveEffectivePermissions(user);
    return hasAnyPermission(effectivePerms, requiredPermissions);
  }
}
