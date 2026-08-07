import { z } from 'zod';
import { baseFirestoreModelSchema, baseCreateInputSchema } from '../../validators/base';

export const designationSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1, 'Company ID is required'),
  departmentId: z.string().optional(),
  title: z.string().min(1, 'Designation title is required'),
  code: z.string().min(1, 'Designation code is required').transform((v) => v.toUpperCase()),
  level: z.number().int().min(1, 'Seniority level must be positive'),
  description: z.string().optional(),
  roleIds: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const createDesignationSchema = baseCreateInputSchema.merge(
  designationSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    version: true,
    createdBy: true,
    updatedBy: true,
    isDeleted: true,
  })
);

export const updateDesignationSchema = createDesignationSchema.partial();
