export type DealStage = 'Prospecting' | 'Property Tour' | 'Offer Submitted' | 'Under Contract' | 'Escrow' | 'Closed';

export interface CommissionBreakdown {
  totalCommission: number;
  brokerageFee: number;
  agentCommission: number;
  agentSplitPercentage: number;
}

export interface Deal {
  id: string;
  title: string;
  propertyId: string;
  propertyTitle: string;
  leadId: string;
  clientName: string;
  agentId: string;
  agentName: string;
  agreedPrice: number;
  stage: DealStage;
  expectedCloseDate: string;
  actualCloseDate?: string;
  commission: CommissionBreakdown;
  contractUrl?: string;
  createdAt: string;
  updatedAt: string;
}
