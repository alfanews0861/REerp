import { BaseEntity } from './common';

export type VisitStatus = 
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CUSTOMER_NOT_REACHED'
  | 'CUSTOMER_CANCELLED'
  | 'CUSTOMER_NO_SHOW'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RESCHEDULED';

export type VisitMode = 
  | 'OFFICE_TO_SITE'
  | 'HOME_PICKUP'
  | 'DIRECT_TO_SITE'
  | 'SELF_TRAVEL'
  | 'COMPANY_VEHICLE'
  | 'MULTI_CUSTOMER_TRIP'
  | 'OTHER';

export type VisitOutcome = 
  | 'HOT'
  | 'WARM'
  | 'COLD'
  | 'INTERESTED'
  | 'NOT_INTERESTED'
  | 'FOLLOW_UP_REQUIRED'
  | 'BOOKING_DISCUSSION'
  | 'BOOKED'
  | 'RESCHEDULE_REQUIRED'
  | 'NO_FURTHER_ACTION';

export type GpsVerificationStatus = 'GPS_VERIFIED' | 'GPS_APPROXIMATE' | 'GPS_UNAVAILABLE';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  verificationStatus?: GpsVerificationStatus;
}

export interface PickupDetails {
  address: string;
  latitude?: number;
  longitude?: number;
  contactNumber?: string;
  notes?: string;
  requestedTime?: string; // ISO string
}

export interface VisitFeedback {
  customerRating?: number; // 1-5
  interestLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  preferredProjectId?: string;
  preferredPlotType?: string;
  budgetRange?: string;
  decisionMakerPresent?: boolean;
  objections?: string[];
  competitorComparison?: string;
  notes?: string;
  photos?: { type: string; url: string }[];
  voiceNoteUrl?: string;
}

export interface SiteVisit extends BaseEntity {
  companyId: string;
  branchId: string;
  projectId: string;
  layoutId?: string;
  
  // People
  leadId?: string; // Original Lead
  personId?: string; // The Person record
  customerId?: string; // If already a customer
  
  // Ownership and Assistance (Part 12 & 13)
  leadOwnerId: string; // The person who originally brought/acquired the lead
  assignedExecutiveId: string; // The executive conducting the visit
  assistingExecutiveIds?: string[]; // E.g., Senior Exec, Manager
  
  // Logistics
  scheduledDate: string; // YYYY-MM-DD
  scheduledStartTime: string; // ISO string
  scheduledEndTime?: string; // ISO string
  visitStatus: VisitStatus;
  visitMode: VisitMode;
  
  pickupDetails?: PickupDetails;
  meetingLocation?: string;
  siteLocation?: string;
  
  // Trip integration
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  
  // Visitors
  expectedVisitors: number;
  actualVisitors?: number;
  
  // Execution Data (Checkpoints)
  checkInTime?: string; // ISO string
  checkInLocation?: LocationData;
  
  arrivalTime?: string; // ISO string
  arrivalLocation?: LocationData;
  
  completionTime?: string; // ISO string
  completionLocation?: LocationData;
  visitDurationMinutes?: number;
  
  // Outcome
  feedback?: VisitFeedback;
  outcome?: VisitOutcome;
  
  nextAction?: string;
  nextFollowUpDate?: string; // ISO string
  linkedBookingId?: string; // If it resulted in a booking
}
