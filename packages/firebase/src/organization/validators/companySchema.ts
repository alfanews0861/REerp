import { z } from 'zod';
import { baseFirestoreModelSchema, baseCreateInputSchema } from '../../validators/base';

export const companyBrandingSchema = z.object({
  logoUrl: z.string().url().optional().or(z.literal('')),
  darkLogoUrl: z.string().url().optional().or(z.literal('')),
  faviconUrl: z.string().url().optional().or(z.literal('')),
  primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid color hex code').optional(),
  secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid color hex code').optional(),
  accentColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Invalid color hex code').optional(),
  fontFamily: z.string().optional(),
});

export const companyAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const companyContactSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(5, 'Phone number is required'),
  secondaryPhone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  supportEmail: z.string().email().optional().or(z.literal('')),
});

export const businessHoursSchema = z.object({
  workingDays: z.array(
    z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
  ).min(1, 'At least one working day required'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Invalid start time format (HH:mm)'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Invalid end time format (HH:mm)'),
  timezone: z.string().min(1, 'Timezone is required'),
  holidays: z.array(z.string()).optional(),
});

export const geoLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().optional(),
});

export const financialYearSchema = z.object({
  startMonth: z.number().int().min(1).max(12),
  endMonth: z.number().int().min(1).max(12),
  currentFinancialYear: z.string().min(1, 'Financial year string (e.g. 2026-2027) is required'),
});

// Indian GST pattern: 2 digits, 5 letters, 4 digits, 1 letter, 1 Z, 1 check digit
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
// Indian PAN pattern: 5 letters, 4 digits, 1 letter
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

export const companySchema = baseFirestoreModelSchema.extend({
  name: z.string().min(1, 'Company name is required'),
  code: z.string().min(1, 'Company code is required').transform((v) => v.toUpperCase()),
  email: z.string().email('Valid company email is required'),
  phone: z.string().min(5, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  taxId: z.string().optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  branding: companyBrandingSchema.optional(),
  gstNumber: z.string().regex(gstRegex, 'Invalid GSTIN format').optional().or(z.literal('')),
  panNumber: z.string().regex(panRegex, 'Invalid PAN format').optional().or(z.literal('')),
  reraId: z.string().optional(),
  registeredAddress: companyAddressSchema.optional(),
  operationalAddress: companyAddressSchema.optional(),
  contactInformation: companyContactSchema.optional(),
  website: z.string().url().optional().or(z.literal('')),
  businessHours: businessHoursSchema.optional(),
  geoLocation: geoLocationSchema.optional(),
  financialYear: financialYearSchema.optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  settings: z.record(z.unknown()).optional(),
});

export const createCompanySchema = baseCreateInputSchema.merge(
  companySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    version: true,
    createdBy: true,
    updatedBy: true,
    isDeleted: true,
  })
);

export const updateCompanySchema = createCompanySchema.partial();
