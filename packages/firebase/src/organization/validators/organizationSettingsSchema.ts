import { z } from 'zod';
import { baseFirestoreModelSchema, baseCreateInputSchema } from '../../validators/base';

export const organizationSettingsSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1, 'Company ID is required'),
  currency: z.object({
    code: z.string().length(3).default('INR'),
    symbol: z.string().min(1).default('₹'),
  }),
  timezone: z.string().default('Asia/Kolkata'),
  dateFormat: z.string().default('DD/MM/YYYY'),
  fiscalYearStartMonth: z.number().int().min(1).max(12).default(4),
  taxSettings: z.object({
    gstEnabled: z.boolean().default(true),
    defaultGstRate: z.number().min(0).max(100).optional(),
    panRequired: z.boolean().default(true),
    reraRequired: z.boolean().default(true),
  }).optional(),
  features: z.object({
    enabledModules: z.array(z.string()).default([]),
  }).optional(),
  notifications: z.object({
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    whatsappNotifications: z.boolean().default(false),
  }).optional(),
});

export const createOrganizationSettingsSchema = baseCreateInputSchema.merge(
  organizationSettingsSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    version: true,
    createdBy: true,
    updatedBy: true,
    isDeleted: true,
  })
);

export const updateOrganizationSettingsSchema = createOrganizationSettingsSchema.partial();
