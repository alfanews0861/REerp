export type CampaignChannel = 'Facebook' | 'Google Ads' | 'Instagram' | 'Email Newsletter' | 'Print' | 'META' | 'GOOGLE' | 'YOUTUBE' | 'WEBSITE' | 'WHATSAPP' | 'SMS' | 'TELECALL' | 'DOOR_TO_DOOR' | 'BANNER' | 'HOARDING' | 'EVENT' | 'REFERRAL' | 'AGENT_NETWORK' | 'CUSTOM' | 'OTHER';

export type CampaignStatus = 'Draft' | 'Active' | 'Paused' | 'Completed' | 'CANCELLED';

export type AttributionModel = 'FIRST_TOUCH' | 'LAST_TOUCH' | 'LINEAR' | 'POSITION_BASED' | 'TIME_DECAY' | 'CUSTOM';

export interface CampaignTouchpoint {
  id: string;
  campaignId: string;
  sourceCode: string; 
  medium: string;
  channel: CampaignChannel;
  touchpoint: string;
  timestamp: string;
  actor: string;
  metadata?: Record<string, any>;
}

export interface CampaignAttribution {
  leadId: string;
  firstTouchId?: string;
  lastTouchId?: string;
  touchpoints: CampaignTouchpoint[];
  attributionModel: AttributionModel;
}

export interface MarketingCampaign {
  id: string;
  companyId: string;
  branchId?: string;
  name: string;
  code: string;
  description?: string;
  channel: CampaignChannel;
  source?: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  
  propertyIds?: string[];
  projectIds: string[];
  
  targetLeads?: number;
  targetSiteVisits?: number;
  targetBookings?: number;
  targetRegistrations?: number;
  
  impressions: number;
  clicks: number;
  leadsGenerated: number;
  qualifiedLeadsGenerated: number;
  siteVisitsGenerated: number;
  bookingsGenerated: number;
  paymentsGenerated: number;
  registrationsGenerated: number;
  
  startDate: string;
  endDate: string;
  
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
