import { UserRole } from '@real-estate-erp/types';

export class FirestoreRulesHelper {
  public static generateRoleCheck(role: UserRole): string {
    return `request.auth.token.role == '${role}'`;
  }

  public static generatePermissionCheck(permission: string): string {
    const [category] = permission.split(':');
    return `('${permission}' in request.auth.token.permissions) || ('${category}:*' in request.auth.token.permissions) || ('*:*' in request.auth.token.permissions)`;
  }
}
