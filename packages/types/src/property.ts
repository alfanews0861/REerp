export type PropertyType = 
  | 'Single Family' 
  | 'Condo' 
  | 'Townhouse' 
  | 'Multi-Family' 
  | 'Commercial' 
  | 'Land' 
  | 'Luxury Villa';

export type ListingStatus = 'Active' | 'Pending' | 'Sold' | 'Off-Market' | 'Draft';

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertyFeatures {
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  lotSizeSqft?: number;
  yearBuilt?: number;
  parkingSpaces?: number;
  hasPool?: boolean;
  hasGarage?: boolean;
  isAirConditioned?: boolean;
}

export interface PropertyListing {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  status: ListingStatus;
  location: PropertyLocation;
  features: PropertyFeatures;
  images: string[];
  documents?: string[];
  agentId: string;
  agentName: string;
  createdAt: string;
  updatedAt: string;
}
