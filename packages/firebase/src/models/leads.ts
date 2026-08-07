import { BaseFirestoreModel } from './base';

export interface LeadSourceModel extends BaseFirestoreModel {
  companyId: string;
  name: string;
  code: string;
  type: 'digital' | 'referral' | 'print' | 'event' | 'walk_in' | 'other';
  description?: string;
}

export interface LeadModel extends BaseFirestoreModel {
  companyId: string;
  branchId: string;
  leadSourceId: string;
  assignedToUserId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  altPhone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  stage: string;
  requirementDetails?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredLocation?: string;
  notes?: string;
}

export interface LeadActivityModel extends BaseFirestoreModel {
  leadId: string;
  userId: string;
  activityType: 'call' | 'email' | 'meeting' | 'site_visit' | 'note' | 'whatsapp';
  description: string;
  date: string;
  durationMinutes?: number;
  outcome?: string;
}

export interface FollowUpModel extends BaseFirestoreModel {
  leadId: string;
  assignedToUserId: string;
  scheduledAt: string;
  completedAt?: string;
  status: 'pending' | 'completed' | 'cancelled' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  reminderSent: boolean;
}
