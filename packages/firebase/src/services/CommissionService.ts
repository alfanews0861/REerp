import { CommissionRule, CommissionRecord, CommissionPool, Lead, PlotBooking, NetworkMember, CommissionStatus } from '@real-estate-erp/types';
import { CommissionRuleRepository, CommissionPoolRepository, CommissionRecordRepository } from '../repositories/commissionRepositories';
import { NetworkService } from './NetworkService';
import { NetworkMemberRepository } from '../repositories/networkRepositories';

export class CommissionService {
  private ruleRepo: CommissionRuleRepository;
  private poolRepo: CommissionPoolRepository;
  private recordRepo: CommissionRecordRepository;
  private networkService: NetworkService;
  private memberRepo: NetworkMemberRepository;

  constructor() {
    this.ruleRepo = new CommissionRuleRepository();
    this.poolRepo = new CommissionPoolRepository();
    this.recordRepo = new CommissionRecordRepository();
    this.networkService = new NetworkService();
    this.memberRepo = new NetworkMemberRepository();
  }

  /**
   * Evaluates the rules and calculates upward commission based on the lead owner's hierarchy.
   * Triggered when BOOKING_FULLY_PAID event is received.
   */
  async calculateCommission(booking: PlotBooking, lead: Lead, saleValue: number): Promise<void> {
    if (!lead.ownerId && !lead.networkMemberId) {
      console.warn('Lead has no owner/network member to attribute commission.');
      return; // No commission to calculate
    }
    
    const ownerMemberId = lead.networkMemberId || lead.ownerId!;
    const ownerMember = await this.memberRepo.findById(ownerMemberId);
    if (!ownerMember) {
      console.warn(`Owner member ${ownerMemberId} not found in network.`);
      return;
    }

    // 1. Get ancestors to allocate upward
    const ancestors = await this.networkService.getAncestors(ownerMember.id);
    const hierarchy = [ownerMember, ...ancestors.reverse()]; // From owner UP to top

    // 2. Fetch all active commission rules for this project/company
    const allRules = await this.ruleRepo.query((q) => {
        return q.where('active', '==', true)
                .where('companyId', '==', ownerMember.companyId);
    });

    const pool: Omit<CommissionPool, 'id'> = {
      bookingId: booking.id,
      projectId: booking.projectId,
      plotId: booking.plotId,
      saleValue,
      totalCommissionCalculated: 0,
      status: 'CALCULATED',
      calculatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const createdPoolId = await this.poolRepo.create(pool);

    let totalCalculated = 0;

    // 3. Process each person in the hierarchy (bottom-up)
    for (const member of hierarchy) {
      // Find matching rule. (Priority logic could be complex, simple version here)
      const validRules = allRules.filter(r => 
        (!r.projectId || r.projectId === booking.projectId) &&
        (!r.positionId || r.positionId === member.positionId) &&
        (!r.networkMemberId || r.networkMemberId === member.id)
      ).sort((a, b) => b.priority - a.priority);

      if (validRules.length > 0) {
        const matchedRule = validRules[0];
        let amount = 0;
        
        if (matchedRule.commissionType === 'PERCENTAGE' && matchedRule.percentage) {
          amount = (saleValue * matchedRule.percentage) / 100;
        } else if (matchedRule.commissionType === 'FIXED_AMOUNT' && matchedRule.fixedAmount) {
          amount = matchedRule.fixedAmount;
        }

        if (amount > 0) {
          const record: Omit<CommissionRecord, 'id'> = {
            poolId: createdPoolId,
            bookingId: booking.id,
            projectId: booking.projectId,
            plotId: booking.plotId,
            networkMemberId: member.id,
            positionId: member.positionId,
            ruleId: matchedRule.id,
            saleValue,
            percentageApplied: matchedRule.percentage,
            fixedAmountApplied: matchedRule.fixedAmount,
            amount,
            status: 'PENDING',
            calculatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await this.recordRepo.create(record);
          totalCalculated += amount;
        }
      }
    }

    // Update pool with final total
    await this.poolRepo.update(createdPoolId, {
      totalCommissionCalculated: totalCalculated
    });
  }
}
