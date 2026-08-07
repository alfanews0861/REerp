export type UserRole =
  | 'super_admin'
  | 'director'
  | 'branch_manager'
  | 'marketing_manager'
  | 'marketing_executive'
  | 'sales_manager'
  | 'sales_executive'
  | 'telecaller'
  | 'accountant'
  | 'driver'
  | 'customer';

export type PermissionCategory =
  | 'company'
  | 'branch'
  | 'department'
  | 'designation'
  | 'team'
  | 'business_unit'
  | 'organization_settings'
  | 'employee'
  | 'attendance'
  | 'campaign'
  | 'lead'
  | 'followup'
  | 'project'
  | 'layout'
  | 'plot'
  | 'booking'
  | 'customer'
  | 'payments'
  | 'vehicle'
  | 'expenses'
  | 'reports'
  | 'dashboard'
  | 'settings'
  | 'notifications'
  | 'ai';

export type PermissionAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'approve'
  | 'assign'
  | 'export'
  | 'import'
  | 'print'
  | 'share';

export type PermissionString =
  | `${PermissionCategory}:${PermissionAction}`
  | `${PermissionCategory}:*`
  | '*:*'
  | '*';

export interface RoleDefinition {
  id: UserRole;
  name: string;
  level: number;
  description: string;
  manageableRoles: UserRole[];
}

export type PermissionMatrix = Record<UserRole, PermissionString[]>;

export interface CustomClaims {
  role?: UserRole;
  permissions?: string[];
  tenantId?: string;
  admin?: boolean;
  [key: string]: unknown;
}

export interface UserSession {
  sessionId: string;
  uid: string;
  deviceId: string;
  deviceInfo: {
    browser: string;
    os: string;
    platform: string;
    ipAddress?: string;
    userAgent: string;
  };
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isActive: boolean;
  refreshTokenId?: string;
}

export interface DeviceValidationInfo {
  deviceId: string;
  userAgent: string;
  ipAddress?: string;
  isTrusted: boolean;
  lastValidatedAt: string;
}

export interface PasswordPolicyConfig {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialCharacters: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}
