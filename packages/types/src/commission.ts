export type CommissionType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'TIERED' | 'MILESTONE' | 'CUSTOM';
export type CommissionStatus = 'NOT_ELIGIBLE' | 'PENDING' | 'CALCULATED' | 'APPROVED' | 'PAYABLE' | 'PAID' | 'REVERSED';
export type SaleChannel = 'DIRECT_COMPANY_SALE' | 'PROFESSIONAL_EXECUTIVE' | 'AGENT_SALE' | 'NETWORK_SALE' | 'WHOLESALE' | 'INVESTOR' | 'REFERRAL' | 'WALK_IN' | 'OTHER';

export interface CommissionRule {
  id: string;
  companyId: string;
  branchId?: string;
  projectId?: string;
  layoutId?: string;
  positionId?: string;      // If rule applies to a specific NetworkPosition
  networkMemberId?: string; // If rule applies to a specific NetworkMember
  saleChannel?: SaleChannel;
  commissionType: CommissionType;
  percentage?: number;
  fixedAmount?: number;
  effectiveFrom: string;    // ISO string
  effectiveTo?: string;     // ISO string
  minimumSaleValue?: number;
  maximumSaleValue?: number;
  priority: number;         // Higher priority rule overrides lower priority if conflicts exist
  active: boolean;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionPool {
  id: string;
  bookingId: string;
  projectId: string;
  plotId: string;
  saleValue: number;
  totalCommissionCalculated: number; // Sum of all generated CommissionRecords
  status: CommissionStatus;
  calculatedAt: string;
  updatedAt: string;
}

export interface CommissionRecord {
  id: string;
  poolId: string;             // Reference to CommissionPool
  bookingId: string;
  projectId: string;
  plotId: string;
  networkMemberId: string;    // The member receiving the commission
  positionId: string;         // The position they held at the time of sale
  ruleId: string;             // The rule used for calculation
  saleValue: number;          
  percentageApplied?: number;
  fixedAmountApplied?: number;
  amount: number;             // The calculated commission amount
  status: CommissionStatus;
  calculatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  paidBy?: string;
  paidAt?: string;
  paymentReference?: string;
  reversalReason?: string;
  reversalDate?: string;
  adjustments?: CommissionAdjustment[];
  createdAt: string;
  updatedAt: string;
}

export interface CommissionAdjustment {
  id: string;
  amount: number; // positive or negative
  reason: string;
  adjustedBy: string;
  adjustedAt: string; // ISO string
}
