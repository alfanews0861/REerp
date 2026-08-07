import { BaseFirestoreModel } from './base';

export interface CompanyModel extends BaseFirestoreModel {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  logoUrl?: string;
  website?: string;
  status: 'active' | 'inactive' | 'suspended';
  settings?: Record<string, unknown>;
}

export interface BranchModel extends BaseFirestoreModel {
  companyId: string;
  name: string;
  code: string;
  address: string;
  managerId?: string;
  phone: string;
  email: string;
}

export interface DepartmentModel extends BaseFirestoreModel {
  companyId: string;
  branchId?: string;
  name: string;
  code: string;
  description?: string;
  managerId?: string;
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
