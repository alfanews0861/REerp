import { UserRole } from '@real-estate-erp/types';
import { ROLE_DEFINITIONS } from './roleMatrix';

export class RoleResolver {
  public static getRoleLevel(role: UserRole): number {
    return ROLE_DEFINITIONS[role]?.level || 0;
  }

  public static isRoleHigherOrEqual(role: UserRole, targetRole: UserRole): boolean {
    return this.getRoleLevel(role) >= this.getRoleLevel(targetRole);
  }

  public static canManageRole(assignerRole: UserRole, targetRole: UserRole): boolean {
    const manageable = ROLE_DEFINITIONS[assignerRole]?.manageableRoles || [];
    return manageable.includes(targetRole);
  }

  public static getManageableRoles(role: UserRole): UserRole[] {
    return ROLE_DEFINITIONS[role]?.manageableRoles || [];
  }
}
