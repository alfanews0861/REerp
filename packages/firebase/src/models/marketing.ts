import { BaseFirestoreModel } from './base';

export interface CampaignModel extends BaseFirestoreModel {
  companyId: string;
  name: string;
  code: string;
  type: 'social_media' | 'email' | 'sms' | 'billboard' | 'print' | 'event';
  channel: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  targetAudience?: string;
  expectedLeads?: number;
}

export interface CampaignExpenseModel extends BaseFirestoreModel {
  campaignId: string;
  companyId: string;
  title: string;
  amount: number;
  date: string;
  paymentStatus: 'pending' | 'paid' | 'partially_paid';
  vendor?: string;
  invoiceUrl?: string;
  notes?: string;
}
