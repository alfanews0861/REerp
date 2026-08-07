import { BaseFirestoreModel } from './base';
import {
  ProjectType,
  ProjectStatus,
  LocationDetails,
  ProjectMembers,
  ProjectPricing,
  Amenities,
  ProjectMedia,
  AreaUnit,
  PlotFacing,
  PlotStatus
} from '@real-estate-erp/types';

export interface ProjectModel extends BaseFirestoreModel {
  name: string;
  code: string;
  projectType: ProjectType;
  status: ProjectStatus;
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
}

export interface LayoutModel extends BaseFirestoreModel {
  projectId: string;
  name: string;
  code: string;
  totalBlocksCount: number;
  totalPlotsCount: number;
  mapUrl?: string;
}

export interface BlockModel extends BaseFirestoreModel {
  projectId: string;
  layoutId: string;
  name: string;
  code: string;
  totalPlotsCount: number;
}

export interface PlotModel extends BaseFirestoreModel {
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
  gpsPoint?: { lat: number; lng: number };
}
