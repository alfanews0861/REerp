export type VehicleStatus = 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
export type FuelType = 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'CNG';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  makeModel: string;
  vehicleType: 'CAB' | 'BUS' | 'MINI_BUS' | 'SUV' | 'TWO_WHEELER';
  capacitySeats: number;
  fuelType: FuelType;
  assignedDriverId?: string;
  assignedDriverName?: string;
  currentOdometerKm: number;
  status: VehicleStatus;
  insuranceExpiryDate?: string;
  fitnessExpiryDate?: string;
  lastServicedDate?: string;
  branchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OdometerLog {
  id: string;
  vehicleId: string;
  driverId: string;
  driverName: string;
  tripType: 'SITE_VISIT' | 'MARKETING' | 'OFFICE_COMMUTE' | 'PERSONAL';
  startOdometerKm: number;
  endOdometerKm?: number;
  totalDistanceKm?: number;
  startTime: string;
  endTime?: string;
  startPhotoUrl?: string;
  endPhotoUrl?: string;
  notes?: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface FuelReceipt {
  id: string;
  vehicleId: string;
  driverId: string;
  driverName: string;
  fuelLiters: number;
  fuelRatePerLiter: number;
  totalCost: number;
  odometerReadingKm: number;
  receiptPhotoUrl?: string;
  fillingStationName?: string;
  paymentMode: 'CASH' | 'COMPANY_CARD' | 'UPI' | 'REIMBURSEMENT';
  isApproved: boolean;
  approvedByUserId?: string;
  createdAt: string;
}

export interface VehicleLocation {
  vehicleId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  speedKmH?: number;
  headingDegrees?: number;
  timestamp: string;
}
