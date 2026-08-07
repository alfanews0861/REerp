import { BaseEntity } from './common';
import { UserRole } from './permissions';

export type { UserRole };

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
