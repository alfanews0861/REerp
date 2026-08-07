import { describe, it, expect } from 'vitest';
import {
  companySchema,
  branchSchema,
  departmentSchema,
} from '../validators';

describe('Organization Validators', () => {
  describe('Company Validator', () => {
    it('should validate a correct company', () => {
      const validCompany = {
        id: 'comp-1',
        name: 'Tech Corp',
        code: 'TC',
        email: 'contact@techcorp.com',
        phone: '1234567890',
        address: '123 Tech Street',
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        createdBy: 'user-1',
        updatedBy: 'user-1',
        isActive: true,
        isDeleted: false,
        version: 1,
      };

      const result = companySchema.safeParse(validCompany);
      expect(result.success).toBe(true);
    });

    it('should fail if email is invalid', () => {
      const invalidCompany = {
        name: 'Tech Corp',
        code: 'TC',
        email: 'invalid-email',
        phone: '1234567890',
        address: '123 Tech Street',
        status: 'active',
      };

      const result = companySchema.safeParse(invalidCompany);
      expect(result.success).toBe(false);
    });
  });

  describe('Branch Validator', () => {
    it('should validate a correct branch', () => {
      const validBranch = {
        id: 'branch-1',
        companyId: 'comp-1',
        name: 'Main Branch',
        code: 'MB',
        address: '123 Tech Street',
        phone: '1234567890',
        email: 'branch@techcorp.com',
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        createdBy: 'user-1',
        updatedBy: 'user-1',
        isActive: true,
        isDeleted: false,
        version: 1,
      };

      const result = branchSchema.safeParse(validBranch);
      expect(result.success).toBe(true);
    });
  });

  describe('Department Validator', () => {
    it('should validate a correct department', () => {
      const validDepartment = {
        id: 'dept-1',
        companyId: 'comp-1',
        name: 'Engineering',
        code: 'ENG',
        type: 'custom',
        status: 'active',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        createdBy: 'user-1',
        updatedBy: 'user-1',
        isActive: true,
        isDeleted: false,
        version: 1,
      };

      const result = departmentSchema.safeParse(validDepartment);
      expect(result.success).toBe(true);
    });
  });
});
