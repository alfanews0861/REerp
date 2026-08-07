export type CampaignChannel = 'Facebook' | 'Google Ads' | 'Instagram' | 'Email Newsletter' | 'Print';
export type CampaignStatus = 'Draft' | 'Active' | 'Paused' | 'Completed';

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  budget: number;
  spent: number;
  propertyIds: string[];
  impressions: number;
  clicks: number;
  leadsGenerated: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}
