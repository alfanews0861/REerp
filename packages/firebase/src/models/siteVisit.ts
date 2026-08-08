import { BaseFirestoreModel } from './base';
import { 
  VisitStatus, 
  VisitMode, 
  VisitOutcome, 
  LocationData, 
  PickupDetails, 
  VisitFeedback 
} from '@real-estate-erp/types';

export interface SiteVisitModel extends BaseFirestoreModel {
  companyId: string;
  branchId: string;
  projectId: string;
  layoutId?: string;
  
  // Relations
  leadId?: string; 
  personId?: string; 
  customerId?: string; 
  
  leadOwnerId: string;
  assignedExecutiveId: string;
  assistingExecutiveIds?: string[];
  
  // Logistics
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime?: string;
  visitStatus: VisitStatus;
  visitMode: VisitMode;
  
  pickupDetails?: PickupDetails;
  meetingLocation?: string;
  siteLocation?: string;
  
  // Trip integration
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  
  expectedVisitors: number;
  actualVisitors?: number;
  
  // Checkpoints
  checkInTime?: string;
  checkInLocation?: LocationData;
  
  arrivalTime?: string;
  arrivalLocation?: LocationData;
  
  completionTime?: string;
  completionLocation?: LocationData;
  visitDurationMinutes?: number;
  
  feedback?: VisitFeedback;
  outcome?: VisitOutcome;
  
  nextAction?: string;
  nextFollowUpDate?: string;
  linkedBookingId?: string;
}
