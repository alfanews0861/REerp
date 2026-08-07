import { z } from 'zod';
import { baseFirestoreModelSchema, baseCreateInputSchema } from '../../validators/base';

export const departmentTypeEnum = z.enum([
  'marketing',
  'sales',
  'accounts',
  'legal',
  'hr',
  'administration',
  'crm',
  'operations',
  'custom',
]);

export const departmentSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1, 'Company ID is required'),
  branchId: z.string().optional(),
  branchIds: z.array(z.string()).optional(),
  name: z.string().min(1, 'Department name is required'),
  code: z.string().min(1, 'Department code is required').transform((v) => v.toUpperCase()),
  type: departmentTypeEnum.default('custom'),
  description: z.string().optional(),
  managerId: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const createDepartmentSchema = baseCreateInputSchema.merge(
  departmentSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    version: true,
    createdBy: true,
    updatedBy: true,
    isDeleted: true,
  })
);

export const updateDepartmentSchema = createDepartmentSchema.partial();
