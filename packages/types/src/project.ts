export type ProjectType = 'RESIDENTIAL' | 'COMMERCIAL' | 'VILLA' | 'FARM_LAND' | 'APARTMENT' | 'MIXED_USE';
export type ProjectStatus = 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'SOLD_OUT';
export type PlotStatus = 'AVAILABLE' | 'BOOKED' | 'REGISTERED';
export type PlotFacing = 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | 'NORTH_EAST' | 'NORTH_WEST' | 'SOUTH_EAST' | 'SOUTH_WEST';
export type AreaUnit = 'SQ_FT' | 'SQ_YARDS' | 'ACRES' | 'HECTARES' | 'GUNTAS';

export interface LocationDetails {
  country: string;
  state: string;
  district: string;
  mandal: string;
  village: string;
  surveyNumbers: string[];
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  polygonBoundaries?: { lat: number; lng: number }[];
}

export interface ProjectMembers {
  companyId: string;
  branchId: string;
  projectManagerId?: string;
  marketingTeamIds: string[];
  salesTeamIds: string[];
  legalTeamIds: string[];
  financeTeamIds: string[];
}

export interface ProjectPricing {
  basePrice: number;
  launchOffer?: number;
  currentPrice: number;
  offerPrice?: number;
  registrationCharges?: number;
  maintenanceCharges?: number;
}

export interface Amenities {
  hasRoads: boolean;
  hasElectricity: boolean;
  hasWater: boolean;
  hasDrainage: boolean;
  hasParks: boolean;
  hasCompoundWall: boolean;
  hasStreetLights: boolean;
  hasClubHouse: boolean;
  hasTemple: boolean;
}

export interface ProjectMedia {
  photos: string[];
  videos: string[];
  droneImages: string[];
  images360: string[];
  brochurePdf?: string;
  masterPlanPdf?: string;
}

export type ApprovalAuthority = 'NUDA' | 'DTCP' | 'HMDA' | 'RERA' | 'GHMC' | 'YTDA' | 'GRAM_PANCHAYAT' | 'OTHER';

export interface Project {
  id: string;
  name: string;
  code: string;
  projectType: ProjectType;
  status: ProjectStatus;
  approvalAuthority?: ApprovalAuthority;
  approvalNumber?: string;
  reraId?: string;
  totalAreaAcres?: number;
  layoutMapUrl?: string;
  featured?: boolean;
  location: LocationDetails;
  members: ProjectMembers;
  pricing: ProjectPricing;
  amenities: Amenities;
  media: ProjectMedia;
  totalArea: number;
  areaUnit: AreaUnit;
  totalLayoutsCount: number;
  totalBlocksCount: number;
  totalPlotsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Layout {
  id: string;
  projectId: string;
  name: string;
  code: string;
  totalBlocksCount: number;
  totalPlotsCount: number;
  mapUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Block {
  id: string;
  projectId: string;
  layoutId: string;
  name: string;
  code: string;
  totalPlotsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  baseRate: number;
  effectiveRate: number;
  facingPremium?: number;
  cornerPremium?: number;
  roadPremium?: number;
  specialPremium?: number;
  discount?: number;
  minimumPermissibleRate?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface Plot {
  id: string;
  projectId: string;
  layoutId: string;
  blockId: string;
  plotNumber: string;
  facing: PlotFacing;
  length: number;
  width: number;
  area: number;
  areaUnit: AreaUnit;
  isCornerPlot: boolean;
  roadWidth: number;
  price: number;
  status: PlotStatus;
  isAvailable: boolean;
  pricingConfig?: PricingConfig;
  bookingExpiryDurationHours?: number;
  currentBookingId?: string;
  bookingExpiryAt?: string;
  gpsPoint?: { lat: number; lng: number };
  createdAt: string;
  updatedAt: string;
}
