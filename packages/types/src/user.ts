import { BaseEntity } from './common';
import { UserRole } from './permissions';
import { CadreLevel, RegistrationType } from './cadre';

export type { UserRole };

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserKycDetails {
  panNumber?: string;
  aadharNumber?: string;
  city?: string;
  branch?: string;
  address?: string;
  bankAccount?: string;
  ifscCode?: string;
  bankName?: string;
  emergencyContact?: string;
}

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
  
  // Cadre & Hierarchy Fields
  cadre?: CadreLevel;
  registrationType?: RegistrationType;
  isProfileCompleted?: boolean;
  
  // Referral & Sponsorship Tracking
  referralCode?: string;
  referredByCode?: string;
  referredByUid?: string;
  referredByName?: string;
  referredByCadre?: CadreLevel;
  hierarchyPath?: string[]; // Array of upline ancestor UIDs
  
  // Cadre Approval & Audit Details
  assignedCadreBy?: string;
  assignedCadreByName?: string;
  assignedCadreAt?: string;
  
  // Direct Appointment & Compensation Mode
  appointedByUid?: string;
  appointedByName?: string;
  compensationType?: 'SALARY' | 'COMMISSION' | 'HYBRID';
  isCommissionEligible?: boolean;
  
  // KYC & Additional Details
  kycDetails?: UserKycDetails;
  metadata?: Record<string, unknown>;
}
