export type LeadRoutingStrategy = 
  | 'OWNER'
  | 'CAMPAIGN_OWNER'
  | 'NETWORK_OWNER'
  | 'TEAM'
  | 'ROUND_ROBIN'
  | 'MANUAL'
  | 'SOURCE_OWNER'
  | 'CUSTOM';

export interface RoundRobinState {
  id: string; // The ID of the round-robin group/campaign
  companyId: string;
  branchId?: string;
  eligibleUserIds: string[];
  lastAssignedUserId?: string;
  assignmentCounts: Record<string, number>;
  active: boolean;
  updatedAt: string;
}

export interface RoutingRule {
  id: string;
  companyId: string;
  name: string;
  strategy: LeadRoutingStrategy;
  sourceCode?: string;
  campaignId?: string;
  projectId?: string;
  priority: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
