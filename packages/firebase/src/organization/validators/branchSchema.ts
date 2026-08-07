import { z } from 'zod';
import { baseFirestoreModelSchema, baseCreateInputSchema } from '../../validators/base';
import { companyAddressSchema, businessHoursSchema, geoLocationSchema } from './companySchema';

export const branchSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1, 'Company ID is required'),
  name: z.string().min(1, 'Branch name is required'),
  code: z.string().min(1, 'Branch code is required').transform((v) => v.toUpperCase()),
  address: z.string().min(1, 'Address is required'),
  structuredAddress: companyAddressSchema.optional(),
  managerId: z.string().optional(),
  managerName: z.string().optional(),
  phone: z.string().min(5, 'Phone number is required'),
  email: z.string().email('Valid email is required'),
  alternatePhone: z.string().optional(),
  workingHours: businessHoursSchema.optional(),
  gpsCoordinates: geoLocationSchema.optional(),
  status: z.enum(['active', 'inactive', 'closed', 'maintenance']),
  isMainBranch: z.boolean().optional(),
});

export const createBranchSchema = baseCreateInputSchema.merge(
  branchSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    version: true,
    createdBy: true,
    updatedBy: true,
    isDeleted: true,
  })
);

export const updateBranchSchema = createBranchSchema.partial();
