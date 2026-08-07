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

export const personAddressSchema = z.object({
  type: z.enum(['PERMANENT', 'CURRENT', 'OFFICE', 'OTHER']).optional(),
  street: z.string().min(2, 'Street is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(2, 'ZIP Code is required'),
  country: z.string().default('India'),
  geoCoordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  googleMapsLink: z.string().url().optional(),
});

export const personIdentitySchema = z.object({
  type: z.enum(['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID', 'RERA_LICENSE', 'OTHER']),
  idNumber: z.string().min(2, 'ID Number is required'),
  documentUrl: z.string().url().optional(),
  verified: z.boolean().default(false),
});

export const personSocialProfileSchema = z.object({
  platform: z.enum(['LINKEDIN', 'FACEBOOK', 'TWITTER', 'INSTAGRAM', 'OTHER']),
  url: z.string().url('Must be a valid URL'),
});

export const personCommunicationPreferencesSchema = z.object({
  phone: z.boolean().default(true),
  whatsapp: z.boolean().default(true),
  sms: z.boolean().default(true),
  email: z.boolean().default(true),
  bestTimeToCall: z.string().optional(),
  doNotDisturb: z.boolean().default(false),
});

export const personRelationshipSchema = z.object({
  relatedPersonId: z.string().optional(),
  relation: z.enum(['FAMILY_MEMBER', 'NOMINEE', 'REFERENCE', 'REFERRAL', 'BUSINESS_CONTACT', 'OTHER']),
  name: z.string().optional(),
  notes: z.string().optional(),
});

export const personSchema = z.object({
  firstName: z.string().min(2, 'First Name is required'),
  lastName: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']).default('PREFER_NOT_TO_SAY'),
  dateOfBirth: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  designation: z.string().optional(),
  photoUrl: z.string().url().optional(),
  preferredLanguage: z.string().optional(),
  nationality: z.string().optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED']).optional(),

  classifications: z.array(
    z.enum(['INDIVIDUAL', 'CUSTOMER', 'LEAD', 'BROKER', 'CHANNEL_PARTNER', 'INVESTOR', 'BUILDER', 'VENDOR', 'LEGAL_ADVISOR', 'EMPLOYEE'])
  ).default(['INDIVIDUAL']),
  
  tags: z.array(
    z.enum(['VIP', 'HOT', 'WARM', 'COLD', 'NRI', 'HNI', 'REPEAT_BUYER', 'REFERRAL', 'BLACKLISTED'])
  ).default([]),

  mobileNumbers: z.array(z.string().min(10, 'Valid mobile number required')).min(1, 'At least one mobile number is required'),
  emailAddresses: z.array(z.string().email('Invalid email')).default([]),
  primaryMobile: z.string().optional(),
  primaryEmail: z.string().email().optional(),
  whatsappNumber: z.string().optional(),
  telegram: z.string().optional(),
  socialProfiles: z.array(personSocialProfileSchema).default([]),
  
  emergencyContact: z.object({
    name: z.string(),
    relation: z.string(),
    phone: z.string(),
  }).optional(),

  addresses: z.array(personAddressSchema).default([]),
  identities: z.array(personIdentitySchema).default([]),
  communicationPreferences: personCommunicationPreferencesSchema.default({
    phone: true,
    whatsapp: true,
    sms: true,
    email: true,
    doNotDisturb: false,
  }),
  relationships: z.array(personRelationshipSchema).default([]),
});

export type PersonSchemaType = z.infer<typeof personSchema>;

export const interactionAttachmentSchema = z.object({
  type: z.enum(['PHOTO', 'VIDEO', 'PDF', 'VOICE_NOTE', 'DOCUMENT']),
  url: z.string().url(),
  name: z.string(),
  sizeBytes: z.number().optional(),
});

export const interactionMeetingDetailsSchema = z.object({
  location: z.string().optional(),
  gpsCoordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  participants: z.array(z.string()).default([]),
  minutes: z.string().optional(),
});

export const interactionTaskDetailsSchema = z.object({
  assignedTo: z.string().min(1),
  dueDate: z.string(),
  reminderTime: z.string().optional(),
  completionPercentage: z.number().min(0).max(100).optional(),
});

export const interactionReminderDetailsSchema = z.object({
  pushNotification: z.boolean().default(false),
  sms: z.boolean().default(false),
  whatsappReady: z.boolean().default(false),
  emailReady: z.boolean().default(false),
});

export const interactionSchema = z.object({
  personId: z.string().min(1, 'Person ID is required'),
  type: z.enum([
    'PHONE_CALL', 'INCOMING_CALL', 'OUTGOING_CALL', 'WHATSAPP', 'SMS', 'EMAIL', 
    'MEETING', 'VIDEO_MEETING', 'OFFICE_VISIT', 'SITE_VISIT', 'NOTE', 'TASK', 
    'REMINDER', 'FOLLOW_UP', 'DOCUMENT_SHARED', 'QUOTATION_SHARED', 'BROCHURE_SHARED'
  ]),
  projectId: z.string().optional(),
  employeeId: z.string().optional(),
  branchId: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  durationSeconds: z.number().optional(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'PENDING']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  outcome: z.enum(['SUCCESS', 'NEUTRAL', 'FAILURE', 'ESCALATED', 'REQUIRES_FOLLOW_UP']).optional(),
  callResult: z.enum(['CONNECTED', 'BUSY', 'NO_ANSWER', 'SWITCHED_OFF', 'WRONG_NUMBER', 'INTERESTED', 'NOT_INTERESTED', 'CALL_BACK']).optional(),
  notes: z.string().optional(),
  nextAction: z.string().optional(),
  nextFollowUpDate: z.string().optional(),
  attachments: z.array(interactionAttachmentSchema).optional(),
  meetingDetails: interactionMeetingDetailsSchema.optional(),
  taskDetails: interactionTaskDetailsSchema.optional(),
  reminderDetails: interactionReminderDetailsSchema.optional(),
});

export type InteractionSchemaType = z.infer<typeof interactionSchema>;
