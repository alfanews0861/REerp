import { z } from 'zod';
import { baseFirestoreModelSchema } from './base';

export const locationDetailsSchema = z.object({
  country: z.string().min(1),
  state: z.string().min(1),
  district: z.string().min(1),
  mandal: z.string().min(1),
  village: z.string().min(1),
  surveyNumbers: z.array(z.string()).min(1),
  googleMapsUrl: z.string().url().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  polygonBoundaries: z.array(z.object({
    lat: z.number(),
    lng: z.number()
  })).optional()
});

export const projectMembersSchema = z.object({
  companyId: z.string().min(1),
  branchId: z.string().min(1),
  projectManagerId: z.string().optional(),
  marketingTeamIds: z.array(z.string()),
  salesTeamIds: z.array(z.string()),
  legalTeamIds: z.array(z.string()),
  financeTeamIds: z.array(z.string())
});

export const projectPricingSchema = z.object({
  basePrice: z.number().nonnegative(),
  launchOffer: z.number().nonnegative().optional(),
  currentPrice: z.number().nonnegative(),
  offerPrice: z.number().nonnegative().optional(),
  registrationCharges: z.number().nonnegative().optional(),
  maintenanceCharges: z.number().nonnegative().optional()
});

export const amenitiesSchema = z.object({
  hasRoads: z.boolean(),
  hasElectricity: z.boolean(),
  hasWater: z.boolean(),
  hasDrainage: z.boolean(),
  hasParks: z.boolean(),
  hasCompoundWall: z.boolean(),
  hasStreetLights: z.boolean(),
  hasClubHouse: z.boolean(),
  hasTemple: z.boolean()
});

export const projectMediaSchema = z.object({
  photos: z.array(z.string().url()),
  videos: z.array(z.string().url()),
  droneImages: z.array(z.string().url()),
  images360: z.array(z.string().url()),
  brochurePdf: z.string().url().optional(),
  masterPlanPdf: z.string().url().optional()
});

export const projectSchema = baseFirestoreModelSchema.extend({
  name: z.string().min(1),
  code: z.string().min(1),
  projectType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'VILLA', 'FARM_LAND', 'APARTMENT', 'MIXED_USE']),
  status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'SOLD_OUT']),
  location: locationDetailsSchema,
  members: projectMembersSchema,
  pricing: projectPricingSchema,
  amenities: amenitiesSchema,
  media: projectMediaSchema,
  totalArea: z.number().nonnegative(),
  areaUnit: z.enum(['SQ_FT', 'SQ_YARDS', 'ACRES', 'HECTARES', 'GUNTAS']),
  totalLayoutsCount: z.number().int().nonnegative(),
  totalBlocksCount: z.number().int().nonnegative(),
  totalPlotsCount: z.number().int().nonnegative()
});

export const layoutSchema = baseFirestoreModelSchema.extend({
  projectId: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  totalBlocksCount: z.number().int().nonnegative(),
  totalPlotsCount: z.number().int().nonnegative(),
  mapUrl: z.string().url().optional()
});

export const blockSchema = baseFirestoreModelSchema.extend({
  projectId: z.string().min(1),
  layoutId: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  totalPlotsCount: z.number().int().nonnegative()
});

export const pricingConfigSchema = z.object({
  baseRate: z.number().nonnegative(),
  effectiveRate: z.number().nonnegative(),
  facingPremium: z.number().nonnegative().optional(),
  cornerPremium: z.number().nonnegative().optional(),
  roadPremium: z.number().nonnegative().optional(),
  specialPremium: z.number().nonnegative().optional(),
  discount: z.number().nonnegative().optional(),
  minimumPermissibleRate: z.number().nonnegative().optional(),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional()
});

export const plotSchema = baseFirestoreModelSchema.extend({
  projectId: z.string().min(1),
  layoutId: z.string().min(1),
  blockId: z.string().min(1),
  plotNumber: z.string().min(1),
  facing: z.enum(['EAST', 'WEST', 'NORTH', 'SOUTH', 'NORTH_EAST', 'NORTH_WEST', 'SOUTH_EAST', 'SOUTH_WEST']),
  length: z.number().positive(),
  width: z.number().positive(),
  area: z.number().positive(),
  areaUnit: z.enum(['SQ_FT', 'SQ_YARDS', 'ACRES', 'HECTARES', 'GUNTAS']),
  isCornerPlot: z.boolean(),
  roadWidth: z.number().nonnegative(),
  price: z.number().nonnegative(),
  status: z.enum(['AVAILABLE', 'BOOKED', 'REGISTERED']),
  isAvailable: z.boolean(),
  pricingConfig: pricingConfigSchema.optional(),
  bookingExpiryDurationHours: z.number().int().nonnegative().optional(),
  currentBookingId: z.string().optional(),
  bookingExpiryAt: z.string().optional(),
  gpsPoint: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional()
});
