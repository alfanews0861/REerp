import { UserProfile, RecipientScope } from '@real-estate-erp/types';

export interface MessagePermissionResult {
  allowed: boolean;
  reason?: string;
}

export interface RecipientCategoryOption {
  id: RecipientScope;
  label: string;
  description: string;
  badgeColor?: string;
}

/**
 * Checks if a user belongs to Office Staff (Operations, Accounts, IT, Admin, Branch Ops).
 */
export function isOfficeStaff(user?: UserProfile | null): boolean {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  const cadre = (user.cadre || '').toLowerCase();
  const regType = (user.registrationType || '').toLowerCase();

  return (
    cadre === 'office_staff' ||
    regType === 'office_staff' ||
    role === 'accountant' ||
    role === 'super_admin' ||
    role === 'director' ||
    role === 'branch_manager'
  );
}

/**
 * Checks if a user is an Executive Admin / Director / Super Admin.
 */
export function isAdminUser(user?: UserProfile | null): boolean {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  const cadre = (user.cadre || '').toLowerCase();

  return (
    role === 'super_admin' ||
    role === 'director' ||
    cadre === 'director'
  );
}

/**
 * Checks if a user is a Chief General Manager (CGM - Cadre Rank 2).
 */
export function isCGM(user?: UserProfile | null): boolean {
  if (!user) return false;
  const cadre = (user.cadre || '').toLowerCase();
  return cadre === 'cgm';
}

/**
 * Checks if a user belongs to the Marketing & Sales Field/Cadre Network.
 */
export function isMarketingMember(user?: UserProfile | null): boolean {
  if (!user) return false;
  const role = (user.role || '').toLowerCase();
  const cadre = (user.cadre || '').toLowerCase();
  const regType = (user.registrationType || '').toLowerCase();

  if (regType === 'marketing_agent') return true;

  const marketingCadres: string[] = [
    'cgm',
    'gm',
    'agm',
    'senior_sales_manager',
    'sales_manager',
    'team_lead',
    'sales_executive',
    'telecaller',
  ];

  const marketingRoles: string[] = [
    'marketing_manager',
    'marketing_executive',
    'sales_manager',
    'sales_executive',
    'telecaller',
  ];

  return marketingCadres.includes(cadre) || marketingRoles.includes(role);
}

/**
 * Checks if recipient is in the same team hierarchy / reporting line as sender.
 */
export function isTeamMember(sender: UserProfile, recipient: UserProfile): boolean {
  if (sender.uid === recipient.uid) return true;

  // 1. Direct sponsor / referral connection
  if (recipient.referredByUid === sender.uid || sender.referredByUid === recipient.uid) {
    return true;
  }

  // 2. Direct appointment (e.g. Telecaller appointed by manager/leader)
  if (recipient.appointedByUid === sender.uid || sender.appointedByUid === recipient.uid) {
    return true;
  }

  // 3. In sender's downline hierarchy path
  if (recipient.hierarchyPath && Array.isArray(recipient.hierarchyPath) && recipient.hierarchyPath.includes(sender.uid)) {
    return true;
  }

  // 4. In recipient's upline hierarchy path
  if (sender.hierarchyPath && Array.isArray(sender.hierarchyPath) && sender.hierarchyPath.includes(recipient.uid)) {
    return true;
  }

  // 5. If same reporting manager or same branch manager
  if (
    sender.metadata?.reportingManager &&
    recipient.metadata?.reportingManager &&
    sender.metadata.reportingManager === recipient.metadata.reportingManager
  ) {
    return true;
  }

  return false;
}

/**
 * Validates whether a sender is authorized to send a message to a recipient.
 * 
 * Rules:
 * 1. Admin / Director: Can message anyone (Office staff, marketing, individual staff).
 * 2. CGM (Chief General Manager): Can message fellow CGMs, office staff, and marketing downline teams.
 * 3. Marketing Team (Agents, TLs, SMs, Telecallers): Can message their team members and office staff.
 * 4. Office Staff: Can message admins, other office staff, and marketing members.
 */
export function canSendMessage(sender?: UserProfile | null, recipient?: UserProfile | null): MessagePermissionResult {
  if (!sender || !recipient) {
    return { allowed: false, reason: 'Invalid sender or recipient information.' };
  }

  if (sender.uid === recipient.uid) {
    return { allowed: true, reason: 'Self notes & reminders allowed.' };
  }

  // Rule 1: Admin / Super Admin / Director has unrestricted messaging access
  if (isAdminUser(sender)) {
    return { allowed: true, reason: 'Administrative privilege: unrestricted access.' };
  }

  // Rule 2: CGM (Chief General Manager) Rules
  if (isCGM(sender)) {
    // CGM can message fellow CGMs
    if (isCGM(recipient)) {
      return { allowed: true, reason: 'CGM Peer-to-Peer communication authorized.' };
    }
    // CGM can message Office Staff
    if (isOfficeStaff(recipient)) {
      return { allowed: true, reason: 'Communication with Office Staff authorized.' };
    }
    // CGM can message their team members / downline network
    if (isTeamMember(sender, recipient)) {
      return { allowed: true, reason: 'Downline marketing network communication authorized.' };
    }
    // CGM can message Directors/Admins
    if (isAdminUser(recipient)) {
      return { allowed: true, reason: 'Executive reporting authorized.' };
    }

    return {
      allowed: true, // CGMs have high-tier leadership reach across the marketing division
      reason: 'Senior Executive CGM communication authorized.',
    };
  }

  // Rule 3: Marketing Team (Telecallers, Executives, Team Leads, Sales Managers)
  if (isMarketingMember(sender)) {
    // Can message Office Staff (Accounts, Admin, Operations)
    if (isOfficeStaff(recipient)) {
      return { allowed: true, reason: 'Operational support communication with Office Staff authorized.' };
    }
    // Can message members of their team / hierarchy reporting line
    if (isTeamMember(sender, recipient)) {
      return { allowed: true, reason: 'Internal team hierarchy communication authorized.' };
    }
    // Can message Directors / Admins for escalation
    if (isAdminUser(recipient)) {
      return { allowed: true, reason: 'Executive escalation authorized.' };
    }

    // Block lateral messaging across unrelated parallel sales branches unless in same hierarchy
    return {
      allowed: false,
      reason: 'Marketing members can only message their designated team members and Office Staff.',
    };
  }

  // Rule 4: Office Staff (Accounts, Operations, Branch Ops)
  if (isOfficeStaff(sender)) {
    // Can message Admins & Directors
    if (isAdminUser(recipient)) {
      return { allowed: true, reason: 'Executive communication authorized.' };
    }
    // Can message other Office Staff
    if (isOfficeStaff(recipient)) {
      return { allowed: true, reason: 'Inter-departmental Office Staff communication authorized.' };
    }
    // Can message Marketing members (for documentation, payments, approvals)
    if (isMarketingMember(recipient)) {
      return { allowed: true, reason: 'Operational coordination with marketing associate authorized.' };
    }

    return { allowed: true, reason: 'Office Staff authorized communication.' };
  }

  return { allowed: false, reason: 'No matching communication permission rule found.' };
}

/**
 * Returns the permitted target categories for the current sender when composing a message.
 */
export function getAllowedRecipientCategories(sender?: UserProfile | null): RecipientCategoryOption[] {
  if (!sender) return [];

  const categories: RecipientCategoryOption[] = [
    {
      id: 'INDIVIDUAL',
      label: 'Direct 1-on-1 Message',
      description: 'Send a private message to a specific staff member or associate',
      badgeColor: 'primary',
    },
  ];

  if (isAdminUser(sender)) {
    categories.push(
      {
        id: 'OFFICE_STAFF',
        label: 'All Office Staff',
        description: 'Broadcast announcement to all Operations, Accounts, and Corporate Staff',
        badgeColor: 'info',
      },
      {
        id: 'MARKETING_TEAM',
        label: 'All Marketing Network',
        description: 'Broadcast announcement to all CGMs, Sales Managers, TLs, and Associates',
        badgeColor: 'success',
      },
      {
        id: 'ALL_COMPANY',
        label: 'Entire Organization (All Staff)',
        description: 'Company-wide official broadcast to all departments and cadres',
        badgeColor: 'error',
      }
    );
  } else if (isCGM(sender)) {
    categories.push(
      {
        id: 'PEER_CGMS',
        label: 'CGM Leadership Forum (Peer CGMs)',
        description: 'Collaborate and message with all Chief General Managers',
        badgeColor: 'secondary',
      },
      {
        id: 'OFFICE_STAFF',
        label: 'Office Staff Desk',
        description: 'Reach Accounts, Admin, and Operations Desk',
        badgeColor: 'info',
      },
      {
        id: 'MARKETING_TEAM',
        label: 'My Downline Network',
        description: 'Broadcast announcement to all teams and associates under your CGM wing',
        badgeColor: 'success',
      }
    );
  } else if (isMarketingMember(sender)) {
    categories.push(
      {
        id: 'OFFICE_STAFF',
        label: 'Office Staff Desk',
        description: 'Send inquiry or support request to Accounts, Legal, or Operations Staff',
        badgeColor: 'info',
      },
      {
        id: 'MARKETING_TEAM',
        label: 'My Team Members',
        description: 'Message leads and associates within your direct reporting hierarchy',
        badgeColor: 'success',
      }
    );
  } else if (isOfficeStaff(sender)) {
    categories.push(
      {
        id: 'OFFICE_STAFF',
        label: 'All Office Staff',
        description: 'Communicate across Accounts, Administration, and Operations colleagues',
        badgeColor: 'info',
      }
    );
  }

  return categories;
}

/**
 * Filters a list of all system users to only those whom the sender is allowed to message.
 */
export function filterAllowedRecipients(sender?: UserProfile | null, allUsers: UserProfile[] = []): UserProfile[] {
  if (!sender) return [];

  return allUsers.filter((user) => {
    if (user.uid === sender.uid) return false;
    const { allowed } = canSendMessage(sender, user);
    return allowed;
  });
}

/**
 * Checks whether a sender has broadcast / group announcement authority.
 */
export function canCreateBroadcast(sender?: UserProfile | null): boolean {
  if (!sender) return false;
  return isAdminUser(sender) || isCGM(sender) || sender.cadre === 'gm' || sender.cadre === 'agm' || sender.role === 'marketing_manager';
}
