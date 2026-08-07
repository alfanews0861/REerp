import { BaseEntity } from './common';

export type UserRole = 'super_admin' | 'admin' | 'marketing_manager' | 'sales_agent' | 'client';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserProfile extends BaseEntity {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: UserRole;
  status: UserStatus;
  tenantId?: string;
  permissions: string[];
  metadata?: Record<string, unknown>;
}
