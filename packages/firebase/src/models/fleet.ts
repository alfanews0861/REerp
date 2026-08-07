import { BaseFirestoreModel } from './base';

export interface VehicleModel extends BaseFirestoreModel {
  companyId: string;
  branchId: string;
  vehicleNumber: string;
  make: string;
  model: string;
  type: 'car' | 'bus' | 'van' | 'bike' | 'truck';
  registrationYear: number;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_service';
  fuelType: 'petrol' | 'diesel' | 'ev' | 'cng';
  currentOdometer: number;
}

export interface DriverModel extends BaseFirestoreModel {
  companyId: string;
  branchId: string;
  employeeId?: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'active' | 'on_leave' | 'inactive';
  phone: string;
}

export interface VehicleTripModel extends BaseFirestoreModel {
  vehicleId: string;
  driverId: string;
  startOdometer: number;
  endOdometer?: number;
  distance?: number;
  purpose: string;
  startLocation: string;
  endLocation?: string;
  startTime: string;
  endTime?: string;
  status: 'ongoing' | 'completed' | 'cancelled';
}

export interface FuelEntryModel extends BaseFirestoreModel {
  vehicleId: string;
  driverId: string;
  date: string;
  odometer: number;
  quantityLiters: number;
  costPerLiter: number;
  totalCost: number;
  fuelStation?: string;
  receiptUrl?: string;
}
