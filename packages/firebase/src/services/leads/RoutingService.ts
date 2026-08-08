import { LeadCaptureRequestDTO } from './dto';
import { LeadRoutingStrategy, RoundRobinState } from '@real-estate-erp/types';

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
    let telecallerId = dto.telecallerId;
    let networkMemberId = dto.networkMemberId;

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
      ownerId = assigned;
    }

    return { ownerId, telecallerId, networkMemberId, routingStrategy: strategy };
  }

  /**
   * Simple round-robin mock implementation.
   * In reality, this would query a RoundRobinState doc, update it via a transaction, and return the user.
   */
  private async executeRoundRobin(groupId: string): Promise<string> {
    // Mock user IDs for round-robin
    const eligibleUsers = ['USER_1', 'USER_2', 'USER_3'];
    const randomUser = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
    return randomUser;
  }
}
