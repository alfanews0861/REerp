import { CustomClaims, UserRole } from '@real-estate-erp/types';
import { ParsedToken } from 'firebase/auth';

export class ClaimsResolver {
  public static extractClaims(tokenResult: ParsedToken | Record<string, unknown>): CustomClaims {
    const claims = (tokenResult.claims || tokenResult) as Record<string, unknown>;
    return {
      role: (claims.role as UserRole) || 'customer',
      permissions: (claims.permissions as string[]) || [],
      tenantId: claims.tenantId as string | undefined,
      admin: Boolean(claims.admin || claims.role === 'super_admin'),
      ...claims,
    };
  }

  public static hasRoleInClaims(claims: CustomClaims | null, role: UserRole): boolean {
    if (!claims) return false;
    return claims.role === role;
  }
}
