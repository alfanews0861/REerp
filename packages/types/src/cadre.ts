export type CadreLevel =
  | 'director'              // Level 1 (Director / Management / Super Admin)
  | 'cgm'                   // Level 2 (Chief General Manager)
  | 'gm'                    // Level 3 (General Manager)
  | 'agm'                   // Level 4 (Assistant General Manager)
  | 'senior_sales_manager'  // Level 5 (Senior Sales Manager / Branch Manager)
  | 'sales_manager'         // Level 6 (Sales Manager)
  | 'team_lead'             // Level 7 (Team Leader)
  | 'sales_executive'       // Level 8 (Sales Executive / Associate / Agent)
  | 'telecaller'            // Level 8 (Marketing Telecaller - Lead Calling & Customer Connect)
  | 'office_staff';         // Office / Corporate Staff (Admin, Accounts, Operations)

export type RegistrationType = 'marketing_agent' | 'office_staff' | 'customer';

export const CADRE_HIERARCHY_RANK: Record<CadreLevel, number> = {
  director: 1,
  cgm: 2,
  gm: 3,
  agm: 4,
  senior_sales_manager: 5,
  sales_manager: 6,
  team_lead: 7,
  sales_executive: 8,
  telecaller: 8,
  office_staff: 99,
};

export const CADRE_DISPLAY_NAMES: Record<CadreLevel, string> = {
  director: 'Director / Management',
  cgm: 'Chief General Manager (CGM)',
  gm: 'General Manager (GM)',
  agm: 'Asst. General Manager (AGM)',
  senior_sales_manager: 'Senior Sales Manager (SSM)',
  sales_manager: 'Sales Manager (SM)',
  team_lead: 'Team Leader (TL)',
  sales_executive: 'Sales Executive / Associate (Rank 8)',
  telecaller: 'Marketing Telecaller (Rank 8)',
  office_staff: 'Office Staff (Operations/Accounts)',
};

/**
 * Returns whether an actor of actorCadre can assign/change targetCadre.
 * Rule: Actor can ONLY assign cadres that are strictly LOWER in rank (rank number > actor rank number).
 * If targetCadre is office_staff, ONLY director / management (rank 1) can approve.
 */
export function canAssignCadre(actorCadre: CadreLevel | string | undefined, targetCadre: CadreLevel): boolean {
  if (!actorCadre) return false;
  const actor = actorCadre.toLowerCase() as CadreLevel;

  // Office staff check: Only Director / Super Admin / Management can approve
  if (targetCadre === 'office_staff') {
    return actor === 'director' || actor === ('super_admin' as unknown as CadreLevel);
  }

  const actorRank = CADRE_HIERARCHY_RANK[actor] ?? 999;
  const targetRank = CADRE_HIERARCHY_RANK[targetCadre] ?? 999;

  // Target must be strictly lower in the hierarchy (i.e. targetRank > actorRank)
  return targetRank > actorRank;
}

/**
 * Returns the list of all cadres that an actor with actorCadre is authorized to assign.
 */
export function getAllowedAssignableCadres(actorCadre: CadreLevel | string | undefined): CadreLevel[] {
  if (!actorCadre) return [];
  const actor = actorCadre.toLowerCase() as CadreLevel;
  const actorRank = CADRE_HIERARCHY_RANK[actor] ?? 999;

  const marketingCadres: CadreLevel[] = [
    'cgm',
    'gm',
    'agm',
    'senior_sales_manager',
    'sales_manager',
    'team_lead',
    'sales_executive',
    'telecaller',
  ];

  const allowed = marketingCadres.filter((c) => (CADRE_HIERARCHY_RANK[c] ?? 999) > actorRank);

  // If director, office_staff can also be assigned
  if (actor === 'director' || actor === ('super_admin' as unknown as CadreLevel)) {
    allowed.push('office_staff');
  }

  return allowed;
}

/**
 * Verifies if the actor is authorized to approve office staff.
 */
export function canApproveOfficeStaff(actorRoleOrCadre: string | undefined): boolean {
  if (!actorRoleOrCadre) return false;
  const normalized = actorRoleOrCadre.toLowerCase();
  return (
    normalized === 'director' ||
    normalized === 'super_admin' ||
    normalized === 'management' ||
    normalized === 'managing_director'
  );
}

export interface ReferralLookupResult {
  valid: boolean;
  code: string;
  sponsorUid?: string;
  sponsorName?: string;
  sponsorCadre?: CadreLevel;
  sponsorRole?: string;
  sponsorPhone?: string;
  sponsorBranch?: string;
  error?: string;
}

export type CompensationType = 'SALARY' | 'COMMISSION' | 'HYBRID';

/**
 * Checks if a leader can directly recruit and appoint a telecaller under their specific pool.
 * Any leader of rank <= 7 (Director, CGM, GM, AGM, SSM, SM, Team Lead) can directly appoint telecallers.
 */
export function canDirectlyAppointTelecaller(actorCadre: CadreLevel | string | undefined): boolean {
  if (!actorCadre) return false;
  const actor = actorCadre.toLowerCase() as CadreLevel;
  const actorRank = CADRE_HIERARCHY_RANK[actor] ?? 999;
  return actorRank <= 7; // All leaders above Rank 8
}

/**
 * Checks whether a cadre is eligible for multi-tier sales commissions.
 * Telecallers and office staff are salary-based and NOT eligible for plot sales commission.
 */
export function isCommissionEligible(cadreOrRole: CadreLevel | string | undefined): boolean {
  if (!cadreOrRole) return false;
  const normalized = cadreOrRole.toLowerCase();
  if (normalized === 'telecaller' || normalized === 'office_staff' || normalized === 'accountant' || normalized === 'admin') {
    return false;
  }
  return true;
}

/**
 * Evaluates strict Lead Data Privacy and Isolation.
 * Ensures telecaller leads are ONLY visible to the telecaller and their appointing leader/upline hierarchy.
 * Prevents leads from leaking to lateral or parallel teams.
 */
export function canAccessLead(
  user: { uid: string; role?: string; cadre?: string; hierarchyPath?: string[] } | undefined,
  lead: {
    assignedTelecallerId?: string;
    telecallerId?: string;
    ownerId?: string;
    assignedTo?: string;
    appointedByUid?: string;
    leadIntroducerId?: string;
    hierarchyPath?: string[];
  } | undefined
): boolean {
  if (!user || !lead) return false;

  const role = (user.role || '').toLowerCase();
  const cadre = (user.cadre || '').toLowerCase();

  // 1. Company Director / Super Admin / Management can oversee all leads
  if (role === 'director' || role === 'super_admin' || cadre === 'director' || role === 'managing_director') {
    return true;
  }

  // 2. The Telecaller / Executive who owns or is assigned the lead
  if (
    lead.assignedTelecallerId === user.uid ||
    lead.telecallerId === user.uid ||
    lead.ownerId === user.uid ||
    lead.assignedTo === user.uid
  ) {
    return true;
  }

  // 3. The appointing Leader / Manager who appointed the telecaller
  if (lead.appointedByUid === user.uid || lead.leadIntroducerId === user.uid) {
    return true;
  }

  // 4. Upline leadership in the exact hierarchy reporting path
  if (lead.hierarchyPath && Array.isArray(lead.hierarchyPath) && lead.hierarchyPath.includes(user.uid)) {
    return true;
  }

  // 5. Cross-team / parallel leader access is strictly blocked
  return false;
}
