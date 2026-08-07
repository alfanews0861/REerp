import { BaseFirestoreModel } from './base';

export interface CompanyBranding {
  logoUrl?: string;
  darkLogoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
}

export interface CompanyAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CompanyContact {
  email: string;
  phone: string;
  secondaryPhone?: string;
  website?: string;
  supportEmail?: string;
}

export interface BusinessHours {
  workingDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  startTime: string;
  endTime: string;
  timezone: string;
  holidays?: string[];
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface FinancialYear {
  startMonth: number;
  endMonth: number;
  currentFinancialYear: string;
}

export interface CompanyModel extends BaseFirestoreModel {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  logoUrl?: string;
  branding?: CompanyBranding;
  gstNumber?: string;
  panNumber?: string;
  reraId?: string;
  registeredAddress?: CompanyAddress;
  operationalAddress?: CompanyAddress;
  contactInformation?: CompanyContact;
  website?: string;
  businessHours?: BusinessHours;
  geoLocation?: GeoLocation;
  financialYear?: FinancialYear;
  status: 'active' | 'inactive' | 'suspended';
  settings?: Record<string, unknown>;
}

export interface BranchModel extends BaseFirestoreModel {
  companyId: string;
  name: string;
  code: string;
  address: string;
  structuredAddress?: CompanyAddress;
  managerId?: string;
  managerName?: string;
  phone: string;
  email: string;
  alternatePhone?: string;
  workingHours?: BusinessHours;
  gpsCoordinates?: GeoLocation;
  status: 'active' | 'inactive' | 'closed' | 'maintenance';
  isMainBranch?: boolean;
}

export type DepartmentType =
  | 'marketing'
  | 'sales'
  | 'accounts'
  | 'legal'
  | 'hr'
  | 'administration'
  | 'crm'
  | 'operations'
  | 'custom';

export interface DepartmentModel extends BaseFirestoreModel {
  companyId: string;
  branchId?: string;
  branchIds?: string[];
  name: string;
  code: string;
  type?: DepartmentType;
  description?: string;
  managerId?: string;
  status?: 'active' | 'inactive';
}

export interface DesignationModel extends BaseFirestoreModel {
  companyId: string;
  departmentId?: string;
  title: string;
  code: string;
  level: number;
  description?: string;
  roleIds?: string[];
  status: 'active' | 'inactive';
}

export interface TeamMember {
  userId: string;
  roleInTeam?: 'leader' | 'member' | 'co_leader';
  joinedAt?: string;
}

export type TeamType = 'marketing' | 'sales' | 'cross_functional' | 'custom';

export interface TeamModel extends BaseFirestoreModel {
  companyId: string;
  branchId?: string;
  departmentId?: string;
  name: string;
  code: string;
  type: TeamType;
  leaderId?: string;
  memberIds: string[];
  members?: TeamMember[];
  description?: string;
  status: 'active' | 'inactive';
}

export interface OrganizationSettingsModel extends BaseFirestoreModel {
  companyId: string;
  currency: {
    code: string;
    symbol: string;
  };
  timezone: string;
  dateFormat: string;
  fiscalYearStartMonth: number;
  taxSettings?: {
    gstEnabled: boolean;
    defaultGstRate?: number;
    panRequired?: boolean;
    reraRequired?: boolean;
  };
  features?: {
    enabledModules: string[];
  };
  notifications?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappNotifications: boolean;
  };
}

export interface BusinessUnitModel extends BaseFirestoreModel {
  companyId: string;
  name: string;
  code: string;
  description?: string;
  managerId?: string;
  status: 'active' | 'inactive';
  headcount?: number;
}

export interface RoleModel extends BaseFirestoreModel {
  companyId: string;
  name: string;
  code: string;
  description?: string;
  permissionIds: string[];
  isSystem: boolean;
}

export interface PermissionModel extends BaseFirestoreModel {
  module: string;
  action: string;
  name: string;
  code: string;
  description?: string;
}

export interface UserModel extends BaseFirestoreModel {
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  companyId: string;
  branchId?: string;
  roleIds: string[];
  departmentId?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLoginAt?: string;
}

export interface EmployeeModel extends BaseFirestoreModel {
  userId?: string;
  companyId: string;
  branchId: string;
  departmentId: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  designation: string;
  joiningDate: string;
  salary?: number;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
}
