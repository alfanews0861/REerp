import { BaseFirestoreModel } from './base';

export interface ProjectModel extends BaseFirestoreModel {
  companyId: string;
  branchId: string;
  name: string;
  code: string;
  description?: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    latitude?: number;
    longitude?: number;
  };
  type: 'residential' | 'commercial' | 'mixed_use' | 'plotted';
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  totalArea: number; // in sq ft or acres
  totalBlocks: number;
  totalPlots: number;
  launchDate?: string;
  completionDate?: string;
  amenities: string[];
}

export interface LayoutModel extends BaseFirestoreModel {
  projectId: string;
  name: string;
  layoutCode: string;
  mapUrl?: string;
  layoutImage?: string;
  totalPlots: number;
  status: 'draft' | 'approved' | 'active' | 'archived';
  specifications?: Record<string, unknown>;
}

export interface BlockModel extends BaseFirestoreModel {
  projectId: string;
  layoutId: string;
  name: string;
  code: string;
  totalPlots: number;
  facingDirection?: 'east' | 'west' | 'north' | 'south' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
  notes?: string;
}

export interface PlotModel extends BaseFirestoreModel {
  projectId: string;
  layoutId: string;
  blockId: string;
  plotNumber: string;
  facing: 'east' | 'west' | 'north' | 'south' | 'north_east' | 'north_west' | 'south_east' | 'south_west';
  squareFeet: number;
  sqYards: number;
  pricePerSqFt: number;
  totalPrice: number;
  status: 'available' | 'booked' | 'reserved' | 'sold' | 'blocked';
  dimensions?: {
    length: number;
    width: number;
  };
  cornerPlot: boolean;
  eastBoundary?: string;
  westBoundary?: string;
  northBoundary?: string;
  southBoundary?: string;
}
