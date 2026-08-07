export type PlotStatus = 'AVAILABLE' | 'HOLD' | 'BOOKED' | 'REGISTERED' | 'BLOCKED';
export type PlotFacing = 'EAST' | 'WEST' | 'NORTH' | 'SOUTH' | 'NORTH_EAST' | 'NORTH_WEST' | 'SOUTH_EAST' | 'SOUTH_WEST';
export type PlotType = 'RESIDENTIAL' | 'COMMERCIAL' | 'VILLA' | 'FARM_HOUSE' | 'CORNER_PLOT';

export interface PlotCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlotItem {
  id: string;
  projectId: string;
  projectName: string;
  plotNumber: string;
  surveyNumber?: string;
  sectorBlock?: string;
  sizeSqFt: number;
  sizeSqYards: number;
  dimensionsFeet: string; // e.g. "30x40"
  facing: PlotFacing;
  plotType: PlotType;
  basePricePerSqFt: number;
  plcCharges: number; // Preferential Location Charges
  cornerCharges: number;
  totalPrice: number;
  status: PlotStatus;
  heldByUserId?: string;
  heldUntil?: string; // ISO string
  bookedByCustomerName?: string;
  bookedByCustomerId?: string;
  coordinates?: PlotCoordinates;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPhase {
  id: string;
  phaseName: string;
  totalPlots: number;
  availablePlots: number;
  bookedPlots: number;
  launchDate: string;
  completionDate?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string; // Short code e.g. "GPR-01"
  location: string;
  city: string;
  state: string;
  zipCode?: string;
  geoBounds?: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
  };
  totalAreaAcres: number;
  totalPlotsCount: number;
  availablePlotsCount: number;
  bookedPlotsCount: number;
  registeredPlotsCount: number;
  approvalDetails: {
    dtcpNumber?: string;
    reraId?: string;
    hmdaNumber?: string;
    isApproved: boolean;
  };
  amenities: string[];
  phases: ProjectPhase[];
  layoutMapUrl?: string;
  brochureUrl?: string;
  status: 'UPCOMING' | 'ACTIVE' | 'SOLD_OUT' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}
