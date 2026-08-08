export type LeadStatus =
  | 'NEW'
  | 'CONTACTED'
  | 'QUALIFIED'
  | 'SITE_VISIT_SCHEDULED'
  | 'SITE_VISIT_COMPLETED'
  | 'NEGOTIATING'
  | 'BOOKED'
  | 'CLOSED_LOST'
  | 'INVALID_UNREACHABLE';

export type LeadSource =
  | 'PUBLIC_WEBSITE'
  | 'FACEBOOK_ADS'
  | 'INSTAGRAM_ADS'
  | 'GOOGLE_SEARCH'
  | '99ACRES'
  | 'MAGICBRICKS'
  | 'HOUSING_COM'
  | 'WALK_IN'
  | 'REFERRAL'
  | 'NEWSPAPER_AD'
  | 'COLD_CALLING'
  | 'AGENT'
  | 'SUB_AGENT'
  | 'COMPANY_MARKETING'
  | 'DOOR_TO_DOOR'
  | 'TELECALL'
  | 'NETWORK_SALE'
  | 'OTHER';

export interface LeadFollowUp {
  id: string;
  type: 'CALL' | 'WHATSAPP' | 'EMAIL' | 'IN_PERSON' | 'STATUS_CHANGE';
  notes: string;
  disposition: 'INTERESTED' | 'NOT_REACHABLE' | 'BUSY_CALLBACK_LATER' | 'SITE_VISIT_PROMISED' | 'NOT_INTERESTED';
  nextFollowUpDate?: string; // ISO string
  createdByUserId: string;
  createdByUserName: string;
  createdAt: string;
}

export interface LeadOwnershipTransfer {
  id: string;
  previousOwnerId?: string;
  newOwnerId: string;
  reason: string;
  transferredByUserId: string;
  transferredAt: string; // ISO string
}

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  city?: string;
  source: LeadSource;
  status: LeadStatus;
  budgetMin?: number;
  budgetMax?: number;
  preferredPlotSizeSqFt?: number;
  preferredProjectId?: string;
  preferredProjectName?: string;
  assignedBranchId?: string;
  assignedTelecallerId?: string;
  assignedTelecallerName?: string;
  assignedExecutiveId?: string;
  assignedExecutiveName?: string;
  assistingExecutiveIds?: string[];
  ownerId?: string;
  leadIntroducerId?: string;
  networkMemberId?: string;
  telecallerId?: string;
  campaignId?: string;
  
  // Qualification fields
  interestLevel?: 'HIGH' | 'MEDIUM' | 'LOW';
  purchasePurpose?: 'INVESTMENT' | 'SELF_USE' | 'UNDECIDED';
  familyDecisionStatus?: 'PENDING' | 'DISCUSSED' | 'APPROVED';
  
  // Routing tracking
  routingStrategy?: string;
  assignmentCount?: number;
  
  // Funnel timestamps
  firstContactAt?: string;
  firstResponseAt?: string;
  firstSiteVisitAt?: string;
  bookingAt?: string;
  registrationAt?: string;

  aiIntentScore: number; // 0-100 score calculated by Gemini AI
  aiRecommendation?: string;
  nextFollowUpDate?: string;
  notes?: string;
  followUps: LeadFollowUp[];
  ownershipTransfers?: LeadOwnershipTransfer[];
  createdAt: string;
  updatedAt: string;
}
