export type NetworkMemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED';

export interface NetworkPosition {
  id: string;
  name: string;      // e.g. "Senior General Manager"
  code: string;      // e.g. "Sr CGM"
  level: number;     // e.g. 1 (highest), 2, 3, etc.
  description?: string;
  active: boolean;
  commissionEligibility: boolean; // if false, this position doesn't earn commission
  permissions?: string[];         // specific network permissions for this role
  createdAt: string;
  updatedAt: string;
}

export interface NetworkHierarchyTransfer {
  id: string;
  previousParentId?: string | null;
  newParentId?: string | null;
  reason: string;
  transferredByUserId: string;
  transferredAt: string; // ISO string
}

export interface NetworkMember {
  id: string;
  personId: string;       // Reference to Person entity
  companyId: string;
  branchId: string;
  parentMemberId?: string | null;  // Immediate parent in hierarchy
  ancestors: string[];    // Array of ancestor member IDs for efficient subtree queries
  positionId: string;     // Reference to NetworkPosition
  level: number;          // Copied from Position for easy querying
  networkType: 'PROFESSIONAL_EXECUTIVE' | 'INDEPENDENT_AGENT' | 'SUB_AGENT' | 'AGENCY';
  status: NetworkMemberStatus;
  joinedAt: string;
  activatedAt?: string;
  deactivatedAt?: string;
  hierarchyTransfers?: NetworkHierarchyTransfer[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NetworkTeam {
  id: string;
  name: string;
  companyId: string;
  branchId: string;
  leaderId: string;       // NetworkMember ID of the leader
  memberIds: string[];    // Array of NetworkMember IDs
  projectAssignments: string[]; // Project IDs this team is assigned to
  createdAt: string;
  updatedAt: string;
}
