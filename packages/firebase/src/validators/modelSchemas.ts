import { z } from 'zod';
import { baseFirestoreModelSchema, baseCreateInputSchema } from './base';

// Organization Schemas
export const companySchema = baseFirestoreModelSchema.extend({
  name: z.string().min(1),
  code: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  taxId: z.string().optional(),
  logoUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  settings: z.record(z.unknown()).optional(),
});
export const createCompanySchema = baseCreateInputSchema.merge(companySchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const branchSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  address: z.string().min(1),
  managerId: z.string().optional(),
  phone: z.string().min(1),
  email: z.string().email(),
});
export const createBranchSchema = baseCreateInputSchema.merge(branchSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const departmentSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  branchId: z.string().optional(),
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
  managerId: z.string().optional(),
});
export const createDepartmentSchema = baseCreateInputSchema.merge(departmentSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const roleSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
  permissionIds: z.array(z.string()),
  isSystem: z.boolean(),
});
export const createRoleSchema = baseCreateInputSchema.merge(roleSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const permissionSchema = baseFirestoreModelSchema.extend({
  module: z.string().min(1),
  action: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
});
export const createPermissionSchema = baseCreateInputSchema.merge(permissionSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const userSchema = baseFirestoreModelSchema.extend({
  email: z.string().email(),
  displayName: z.string().min(1),
  phoneNumber: z.string().optional(),
  photoURL: z.string().url().optional(),
  companyId: z.string().min(1),
  branchId: z.string().optional(),
  roleIds: z.array(z.string()),
  departmentId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  lastLoginAt: z.string().optional(),
});
export const createUserSchema = baseCreateInputSchema.merge(userSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const employeeSchema = baseFirestoreModelSchema.extend({
  userId: z.string().optional(),
  companyId: z.string().min(1),
  branchId: z.string().min(1),
  departmentId: z.string().min(1),
  employeeCode: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  designation: z.string().min(1),
  joiningDate: z.string().min(1),
  salary: z.number().nonnegative().optional(),
  emergencyContact: z.object({
    name: z.string().min(1),
    relationship: z.string().min(1),
    phone: z.string().min(1),
  }).optional(),
});
export const createEmployeeSchema = baseCreateInputSchema.merge(employeeSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

// Real Estate Schemas
export const projectSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  branchId: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
  location: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(1),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  type: z.enum(['residential', 'commercial', 'mixed_use', 'plotted']),
  status: z.enum(['planning', 'active', 'completed', 'on_hold']),
  totalArea: z.number().positive(),
  totalBlocks: z.number().int().nonnegative(),
  totalPlots: z.number().int().nonnegative(),
  launchDate: z.string().optional(),
  completionDate: z.string().optional(),
  amenities: z.array(z.string()),
});
export const createProjectSchema = baseCreateInputSchema.merge(projectSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const layoutSchema = baseFirestoreModelSchema.extend({
  projectId: z.string().min(1),
  name: z.string().min(1),
  layoutCode: z.string().min(1),
  mapUrl: z.string().url().optional(),
  layoutImage: z.string().optional(),
  totalPlots: z.number().int().nonnegative(),
  status: z.enum(['draft', 'approved', 'active', 'archived']),
  specifications: z.record(z.unknown()).optional(),
});
export const createLayoutSchema = baseCreateInputSchema.merge(layoutSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const blockSchema = baseFirestoreModelSchema.extend({
  projectId: z.string().min(1),
  layoutId: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  totalPlots: z.number().int().nonnegative(),
  facingDirection: z.enum(['east', 'west', 'north', 'south', 'north_east', 'north_west', 'south_east', 'south_west']).optional(),
  notes: z.string().optional(),
});
export const createBlockSchema = baseCreateInputSchema.merge(blockSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const plotSchema = baseFirestoreModelSchema.extend({
  projectId: z.string().min(1),
  layoutId: z.string().min(1),
  blockId: z.string().min(1),
  plotNumber: z.string().min(1),
  facing: z.enum(['east', 'west', 'north', 'south', 'north_east', 'north_west', 'south_east', 'south_west']),
  squareFeet: z.number().positive(),
  sqYards: z.number().positive(),
  pricePerSqFt: z.number().positive(),
  totalPrice: z.number().positive(),
  status: z.enum(['available', 'booked', 'reserved', 'sold', 'blocked']),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
  }).optional(),
  cornerPlot: z.boolean(),
  eastBoundary: z.string().optional(),
  westBoundary: z.string().optional(),
  northBoundary: z.string().optional(),
  southBoundary: z.string().optional(),
});
export const createPlotSchema = baseCreateInputSchema.merge(plotSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

// Lead Schemas
export const leadSourceSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(['digital', 'referral', 'print', 'event', 'walk_in', 'other']),
  description: z.string().optional(),
});
export const createLeadSourceSchema = baseCreateInputSchema.merge(leadSourceSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const leadSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  branchId: z.string().min(1),
  leadSourceId: z.string().min(1),
  assignedToUserId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(1),
  altPhone: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost']),
  stage: z.string().min(1),
  requirementDetails: z.string().optional(),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  preferredLocation: z.string().optional(),
  notes: z.string().optional(),
});
export const createLeadSchema = baseCreateInputSchema.merge(leadSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const leadActivitySchema = baseFirestoreModelSchema.extend({
  leadId: z.string().min(1),
  userId: z.string().min(1),
  activityType: z.enum(['call', 'email', 'meeting', 'site_visit', 'note', 'whatsapp']),
  description: z.string().min(1),
  date: z.string().min(1),
  durationMinutes: z.number().int().nonnegative().optional(),
  outcome: z.string().optional(),
});
export const createLeadActivitySchema = baseCreateInputSchema.merge(leadActivitySchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const followUpSchema = baseFirestoreModelSchema.extend({
  leadId: z.string().min(1),
  assignedToUserId: z.string().min(1),
  scheduledAt: z.string().min(1),
  completedAt: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled', 'overdue']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  notes: z.string().optional(),
  reminderSent: z.boolean(),
});
export const createFollowUpSchema = baseCreateInputSchema.merge(followUpSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

// Marketing Schemas
export const campaignSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  type: z.enum(['social_media', 'email', 'sms', 'billboard', 'print', 'event']),
  channel: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  budget: z.number().nonnegative(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']),
  targetAudience: z.string().optional(),
  expectedLeads: z.number().int().nonnegative().optional(),
});
export const createCampaignSchema = baseCreateInputSchema.merge(campaignSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const campaignExpenseSchema = baseFirestoreModelSchema.extend({
  campaignId: z.string().min(1),
  companyId: z.string().min(1),
  title: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().min(1),
  paymentStatus: z.enum(['pending', 'paid', 'partially_paid']),
  vendor: z.string().optional(),
  invoiceUrl: z.string().url().optional(),
  notes: z.string().optional(),
});
export const createCampaignExpenseSchema = baseCreateInputSchema.merge(campaignExpenseSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

// Sales Schemas
export const customerSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  userId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().min(1),
  altPhone: z.string().optional(),
  address: z.string().min(1),
  panNumber: z.string().optional(),
  aadharNumber: z.string().optional(),
  bankDetails: z.object({
    bankName: z.string().min(1),
    accountNumber: z.string().min(1),
    ifscCode: z.string().min(1),
    branchName: z.string().min(1),
  }).optional(),
  occupation: z.string().optional(),
});
export const createCustomerSchema = baseCreateInputSchema.merge(customerSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const bookingSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  branchId: z.string().min(1),
  projectId: z.string().min(1),
  layoutId: z.string().min(1),
  blockId: z.string().min(1),
  plotId: z.string().min(1),
  customerId: z.string().min(1),
  agentId: z.string().optional(),
  bookingNumber: z.string().min(1),
  bookingDate: z.string().min(1),
  totalAmount: z.number().positive(),
  discountAmount: z.number().nonnegative(),
  finalAmount: z.number().positive(),
  tokenAmount: z.number().nonnegative(),
  paymentPlanType: z.enum(['outright', 'installment', 'custom']),
  status: z.enum(['draft', 'confirmed', 'cancelled', 'completed']),
  agreementDate: z.string().optional(),
});
export const createBookingSchema = baseCreateInputSchema.merge(bookingSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const paymentSchema = baseFirestoreModelSchema.extend({
  bookingId: z.string().min(1),
  customerId: z.string().min(1),
  companyId: z.string().min(1),
  paymentNumber: z.string().min(1),
  amount: z.number().positive(),
  paymentDate: z.string().min(1),
  paymentMethod: z.enum(['cash', 'cheque', 'bank_transfer', 'upi', 'card']),
  transactionRef: z.string().optional(),
  status: z.enum(['pending', 'verified', 'rejected', 'refunded']),
  remarks: z.string().optional(),
  invoiceUrl: z.string().url().optional(),
});
export const createPaymentSchema = baseCreateInputSchema.merge(paymentSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const receiptSchema = baseFirestoreModelSchema.extend({
  paymentId: z.string().min(1),
  bookingId: z.string().min(1),
  customerId: z.string().min(1),
  receiptNumber: z.string().min(1),
  issueDate: z.string().min(1),
  amount: z.number().positive(),
  pdfUrl: z.string().url().optional(),
  remarks: z.string().optional(),
});
export const createReceiptSchema = baseCreateInputSchema.merge(receiptSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

// Fleet Schemas
export const vehicleSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  branchId: z.string().min(1),
  vehicleNumber: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  type: z.enum(['car', 'bus', 'van', 'bike', 'truck']),
  registrationYear: z.number().int().positive(),
  status: z.enum(['available', 'in_use', 'maintenance', 'out_of_service']),
  fuelType: z.enum(['petrol', 'diesel', 'ev', 'cng']),
  currentOdometer: z.number().nonnegative(),
});
export const createVehicleSchema = baseCreateInputSchema.merge(vehicleSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const driverSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  branchId: z.string().min(1),
  employeeId: z.string().optional(),
  licenseNumber: z.string().min(1),
  licenseExpiry: z.string().min(1),
  status: z.enum(['active', 'on_leave', 'inactive']),
  phone: z.string().min(1),
});
export const createDriverSchema = baseCreateInputSchema.merge(driverSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const vehicleTripSchema = baseFirestoreModelSchema.extend({
  vehicleId: z.string().min(1),
  driverId: z.string().min(1),
  startOdometer: z.number().nonnegative(),
  endOdometer: z.number().nonnegative().optional(),
  distance: z.number().nonnegative().optional(),
  purpose: z.string().min(1),
  startLocation: z.string().min(1),
  endLocation: z.string().optional(),
  startTime: z.string().min(1),
  endTime: z.string().optional(),
  status: z.enum(['ongoing', 'completed', 'cancelled']),
});
export const createVehicleTripSchema = baseCreateInputSchema.merge(vehicleTripSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const fuelEntrySchema = baseFirestoreModelSchema.extend({
  vehicleId: z.string().min(1),
  driverId: z.string().min(1),
  date: z.string().min(1),
  odometer: z.number().nonnegative(),
  quantityLiters: z.number().positive(),
  costPerLiter: z.number().positive(),
  totalCost: z.number().positive(),
  fuelStation: z.string().optional(),
  receiptUrl: z.string().url().optional(),
});
export const createFuelEntrySchema = baseCreateInputSchema.merge(fuelEntrySchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

// Finance Schemas
export const expenseSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  branchId: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().min(1),
  paidByUserId: z.string().min(1),
  approvedByUserId: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']),
  description: z.string().optional(),
  receiptUrl: z.string().url().optional(),
});
export const createExpenseSchema = baseCreateInputSchema.merge(expenseSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const attendanceSchema = baseFirestoreModelSchema.extend({
  employeeId: z.string().min(1),
  companyId: z.string().min(1),
  date: z.string().min(1),
  checkIn: z.string().min(1),
  checkOut: z.string().optional(),
  status: z.enum(['present', 'absent', 'half_day', 'leave']),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  verifiedBy: z.string().optional(),
});
export const createAttendanceSchema = baseCreateInputSchema.merge(attendanceSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

// System Schemas
export const notificationSchema = baseFirestoreModelSchema.extend({
  userId: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
  type: z.enum(['info', 'warning', 'success', 'alert']),
  isRead: z.boolean(),
  readAt: z.string().optional(),
  link: z.string().optional(),
  data: z.record(z.unknown()).optional(),
});
export const createNotificationSchema = baseCreateInputSchema.merge(notificationSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const documentSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  name: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string().min(1),
  fileSize: z.number().int().positive(),
  category: z.string().optional(),
});
export const createDocumentSchema = baseCreateInputSchema.merge(documentSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const mediaSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  size: z.number().int().positive(),
  dimensions: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }).optional(),
  tags: z.array(z.string()),
});
export const createMediaSchema = baseCreateInputSchema.merge(mediaSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const settingSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().optional(),
  key: z.string().min(1),
  value: z.unknown(),
  category: z.string().min(1),
  description: z.string().optional(),
  isPublic: z.boolean(),
});
export const createSettingSchema = baseCreateInputSchema.merge(settingSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const auditLogSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().optional(),
  userId: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  action: z.enum(['create', 'update', 'soft_delete', 'restore', 'hard_delete']),
  previousState: z.record(z.unknown()).optional(),
  newState: z.record(z.unknown()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});
export const createAuditLogSchema = baseCreateInputSchema.merge(auditLogSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));

export const aiSuggestionSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1),
  userId: z.string().optional(),
  targetType: z.enum(['lead', 'pricing', 'marketing', 'workflow']),
  targetId: z.string().optional(),
  prompt: z.string().min(1),
  suggestionText: z.string().min(1),
  confidenceScore: z.number().min(0).max(1),
  status: z.enum(['pending', 'accepted', 'rejected', 'applied']),
  feedback: z.string().optional(),
});
export const createAiSuggestionSchema = baseCreateInputSchema.merge(aiSuggestionSchema.omit({
  id: true, createdAt: true, updatedAt: true, version: true,
}));
