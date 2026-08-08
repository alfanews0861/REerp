import { CommissionRule, CommissionRecord, CommissionPool, Lead, PlotBooking, NetworkMember, CommissionStatus, CommissionAdjustment } from '@real-estate-erp/types';
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
      return; 
    }
    
    // Idempotency Check: Prevent duplicate calculation
    const existingPools = await this.poolRepo.query(q => q.where('bookingId', '==', booking.id));
    const activePool = existingPools.find(p => p.status !== 'REVERSED');
    if (activePool) {
      console.log(`Commission already calculated for booking ${booking.id}. Pool ID: ${activePool.id}`);
      return;
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
      // Deterministic rule precedence:
      // 1. member specific
      // 2. project specific
      // 3. position specific
      // 4. priority value (higher is better)
      const validRules = allRules.filter(r => 
        (!r.projectId || r.projectId === booking.projectId) &&
        (!r.positionId || r.positionId === member.positionId) &&
        (!r.networkMemberId || r.networkMemberId === member.id)
      ).sort((a, b) => {
        if (a.networkMemberId && !b.networkMemberId) return -1;
        if (!a.networkMemberId && b.networkMemberId) return 1;
        if (a.projectId && !b.projectId) return -1;
        if (!a.projectId && b.projectId) return 1;
        if (a.positionId && !b.positionId) return -1;
        if (!a.positionId && b.positionId) return 1;
        return b.priority - a.priority;
      });

      if (validRules.length > 0) {
        const matchedRule = validRules[0];
        let amount = 0;
        
        // Prevent negative values
        const percentage = Math.max(0, matchedRule.percentage || 0);
        const fixedAmount = Math.max(0, matchedRule.fixedAmount || 0);

        if (matchedRule.commissionType === 'PERCENTAGE' && percentage > 0) {
          amount = (saleValue * percentage) / 100;
        } else if (matchedRule.commissionType === 'FIXED_AMOUNT' && fixedAmount > 0) {
          amount = fixedAmount;
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

    // TODO: Optionally validate totalCalculated against a global project commission pool cap.

    // Update pool with final total
    await this.poolRepo.update(createdPoolId, {
      totalCommissionCalculated: totalCalculated
    });
  }

  /**
   * Reverses an entire commission pool (e.g. due to booking cancellation).
   */
  async reverseCommission(bookingId: string, reason: string, userId: string): Promise<void> {
    const pools = await this.poolRepo.query(q => q.where('bookingId', '==', bookingId));
    for (const pool of pools) {
      if (pool.status === 'REVERSED') continue;
      
      await this.poolRepo.update(pool.id, {
        status: 'REVERSED',
        updatedAt: new Date().toISOString()
      });

      const records = await this.recordRepo.query(q => q.where('poolId', '==', pool.id));
      for (const record of records) {
        await this.recordRepo.update(record.id, {
          status: 'REVERSED',
          reversalReason: reason,
          reversalDate: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Adds an adjustment to an existing commission record.
   */
  async addAdjustment(recordId: string, amount: number, reason: string, userId: string): Promise<void> {
    const record = await this.recordRepo.findById(recordId);
    if (!record) throw new Error('Record not found');

    const adj: CommissionAdjustment = {
      id: Date.now().toString(),
      amount,
      reason,
      adjustedBy: userId,
      adjustedAt: new Date().toISOString()
    };

    const adjustments = record.adjustments || [];
    adjustments.push(adj);

    // Note: The total amount paid would be `record.amount + sum(adjustments)`
    await this.recordRepo.update(recordId, {
      adjustments,
      updatedAt: new Date().toISOString()
    });
  }
}
