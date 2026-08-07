import { z } from 'zod';
import { baseFirestoreModelSchema, baseCreateInputSchema } from '../../validators/base';

export const businessUnitSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1, 'Company ID is required'),
  name: z.string().min(1, 'Business unit name is required'),
  code: z.string().min(1, 'Business unit code is required').transform((v) => v.toUpperCase()),
  description: z.string().optional(),
  managerId: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  headcount: z.number().int().nonnegative().optional(),
});

export const createBusinessUnitSchema = baseCreateInputSchema.merge(
  businessUnitSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    version: true,
    createdBy: true,
    updatedBy: true,
    isDeleted: true,
  })
);

export const updateBusinessUnitSchema = createBusinessUnitSchema.partial();
