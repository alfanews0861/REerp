import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const propertyFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  propertyType: z.enum([
    'Single Family',
    'Condo',
    'Townhouse',
    'Multi-Family',
    'Commercial',
    'Land',
    'Luxury Villa',
  ]),
  status: z.enum(['Active', 'Pending', 'Sold', 'Off-Market', 'Draft']),
  location: z.object({
    address: z.string().min(3, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    zipCode: z.string().min(3, 'ZIP Code is required'),
    country: z.string().default('USA'),
  }),
  features: z.object({
    bedrooms: z.coerce.number().min(0),
    bathrooms: z.coerce.number().min(0),
    sqft: z.coerce.number().positive('Square footage must be positive'),
    lotSizeSqft: z.coerce.number().optional(),
    yearBuilt: z.coerce.number().optional(),
  }),
});

export type PropertyFormSchemaType = z.infer<typeof propertyFormSchema>;

export const leadFormSchema = z.object({
  fullName: z.string().min(2, 'Full Name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number required'),
  alternatePhone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  city: z.string().optional(),
  source: z.enum([
    'PUBLIC_WEBSITE',
    'FACEBOOK_ADS',
    'INSTAGRAM_ADS',
    'GOOGLE_SEARCH',
    '99ACRES',
    'MAGICBRICKS',
    'HOUSING_COM',
    'WALK_IN',
    'REFERRAL',
    'NEWSPAPER_AD',
    'COLD_CALLING',
  ]),
  budgetMin: z.coerce.number().optional(),
  budgetMax: z.coerce.number().optional(),
  preferredPlotSizeSqFt: z.coerce.number().optional(),
  preferredProjectId: z.string().optional(),
  notes: z.string().optional(),
});

export type LeadFormSchemaType = z.infer<typeof leadFormSchema>;

export const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  code: z.string().min(2, 'Short code required (e.g., GPR-01)'),
  location: z.string().min(3, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  totalAreaAcres: z.coerce.number().positive('Total area in acres is required'),
  totalPlotsCount: z.coerce.number().int().positive('Total plots count is required'),
  dtcpNumber: z.string().optional(),
  reraId: z.string().optional(),
});

export type ProjectSchemaType = z.infer<typeof projectSchema>;

export const bookingSchema = z.object({
  projectId: z.string().min(1, 'Project selection required'),
  plotId: z.string().min(1, 'Plot selection required'),
  customerId: z.string().min(1, 'Customer is required'),
  salesExecutiveId: z.string().min(1, 'Sales Executive is required'),
  agreedPricePerSqFt: z.coerce.number().positive('Agreed rate required'),
  totalPlotAmount: z.coerce.number().positive('Total plot amount required'),
  discountAmount: z.coerce.number().default(0),
  tokenAmountPaid: z.coerce.number().positive('Token amount paid required'),
  paymentMode: z.enum(['CASH', 'CHEQUE', 'BANK_TRANSFER', 'UPI', 'CARD']),
  notes: z.string().optional(),
});

export type BookingSchemaType = z.infer<typeof bookingSchema>;

export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1, 'Vehicle is required'),
  fuelLiters: z.coerce.number().positive('Fuel liters required'),
  fuelRatePerLiter: z.coerce.number().positive('Fuel rate required'),
  totalCost: z.coerce.number().positive('Total cost required'),
  odometerReadingKm: z.coerce.number().positive('Odometer reading required'),
  paymentMode: z.enum(['CASH', 'COMPANY_CARD', 'UPI', 'REIMBURSEMENT']),
  fillingStationName: z.string().optional(),
});

export type FuelLogSchemaType = z.infer<typeof fuelLogSchema>;

export const attendancePunchSchema = z.object({
  userId: z.string().min(1, 'User ID required'),
  latitude: z.number(),
  longitude: z.number(),
  workSummary: z.string().optional(),
});

export type AttendancePunchSchemaType = z.infer<typeof attendancePunchSchema>;
