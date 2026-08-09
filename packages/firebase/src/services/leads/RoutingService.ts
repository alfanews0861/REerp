import { LeadRoutingStrategy } from '@real-estate-erp/types';
import { LeadCaptureRequestDTO } from './dto';
import { getFirestore, Transaction } from 'firebase-admin/firestore';

export class RoutingService {
  /**
   * Determine the routing for a newly captured lead based on business rules.
   * Returns an object containing the assigned user IDs based on the strategy.
   */
  public async routeLead(dto: LeadCaptureRequestDTO): Promise<{
    ownerId?: string;
    telecallerId?: string;
    networkMemberId?: string;
    routingStrategy: string;
  }> {
    let strategy: LeadRoutingStrategy = 'OWNER';
    let ownerId = dto.ownerId;
    const telecallerId = dto.telecallerId;
    const networkMemberId = dto.networkMemberId;

    // Preserve explicit ownership from DTO if provided
    if (ownerId || telecallerId || networkMemberId) {
      return { ownerId, telecallerId, networkMemberId, routingStrategy: 'OWNER_PRESERVED' };
    }

    // Example configurable logic (in a real system, you'd fetch routing rules from DB)
    if (dto.campaignId) {
      strategy = 'CAMPAIGN_OWNER';
      // MOCK: Look up campaign and assign to its team.
      // We simulate assigning it to a round robin.
      strategy = 'ROUND_ROBIN';
    } else if (dto.sourceCode === 'WALK_IN' || dto.sourceCode === 'DOOR_TO_DOOR') {
      strategy = 'SOURCE_OWNER';
      ownerId = dto.capturedByUserId; // Usually the executive who met them
    } else {
      strategy = 'ROUND_ROBIN';
    }

    if (strategy === 'ROUND_ROBIN') {
      const assigned = await this.executeRoundRobin('DEFAULT_GROUP');
      ownerId = assigned || undefined;
    }

    return { ownerId, telecallerId, networkMemberId, routingStrategy: strategy };
  }

  /**
   * Round-robin implementation with Firebase Transactions.
   */
  private async executeRoundRobin(groupId: string): Promise<string | null> {
    const db = getFirestore();
    const stateRef = db.collection('routing_states').doc(groupId);
    
    try {
      return await db.runTransaction(async (t: Transaction) => {
        const doc = await t.get(stateRef);
        
        // Default mock list if not configured
        let activeUsers = ['user-101', 'user-102', 'user-103'];
        let lastAssignedIndex = -1;

        if (doc.exists) {
          const data = doc.data();
          if (data && data.activeUsers?.length > 0) activeUsers = data.activeUsers;
          if (data && typeof data.lastAssignedIndex === 'number') lastAssignedIndex = data.lastAssignedIndex;
        }

        if (activeUsers.length === 0) return null;

        const nextIndex = (lastAssignedIndex + 1) % activeUsers.length;
        const assignedUser = activeUsers[nextIndex];

        t.set(stateRef, {
          groupId,
          activeUsers,
          lastAssignedIndex: nextIndex,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        return assignedUser;
      });
    } catch (e) {
      console.error('Round robin transaction failed:', e);
      return null;
    }
  }
}
