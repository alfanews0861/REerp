import * as admin from 'firebase-admin';
import { CommissionRule, CommissionRecord, CommissionPool, NetworkMember, PlotBooking } from '@real-estate-erp/types';

export class CommissionEngine {
  private db = admin.firestore();

  /**
   * Calculates commission for a given booking and generates CommissionRecords
   */
  async calculateCommission(bookingId: string): Promise<void> {
    const bookingDoc = await this.db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) throw new Error('Booking not found');
    
    // Idempotency check: Prevent duplicate commission calculation for the same booking
    const existingPools = await this.db.collection('commission_pools')
      .where('bookingId', '==', bookingId)
      .limit(1)
      .get();
      
    if (!existingPools.empty) {
      console.log(`Commission already calculated for booking ${bookingId}. Skipping duplicate run.`);
      return;
    }
    
    const booking = bookingDoc.data() as PlotBooking;
    
    // Create the initial pool
    const poolRef = this.db.collection('commission_pools').doc();
    const pool: CommissionPool = {
      id: poolRef.id,
      bookingId: booking.id,
      projectId: booking.projectId,
      plotId: booking.plotId,
      saleValue: booking.finalSaleAmount,
      totalCommissionCalculated: 0,
      status: 'CALCULATED',
      calculatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Determine the primary lead owner / sales executive
    const executiveId = booking.salesExecutiveId; // In our system this is the person who closed it
    // Note: If marketingExecutiveId is populated, that might take precedence in a real system.
    const networkMemberId = booking.marketingExecutiveId || executiveId;

    if (!networkMemberId) {
      console.warn('No network member assigned to booking', bookingId);
      return; // Or create an empty pool
    }

    const memberDoc = await this.db.collection('network_members').doc(networkMemberId).get();
    if (!memberDoc.exists) {
      console.warn('Network member not found for ID:', networkMemberId);
      return;
    }

    const member = memberDoc.data() as NetworkMember;
    
    // Fetch all active commission rules for this project
    const rulesSnapshot = await this.db.collection('commission_rules')
      .where('projectId', 'in', [booking.projectId, null])
      .where('active', '==', true)
      .get();
      
    const rules = rulesSnapshot.docs.map(d => d.data() as CommissionRule);
    
    // Sort by priority (higher number = higher priority)
    rules.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // The chain of members eligible for commission (the executor + ancestors)
    const eligibleMembers = [member.id, ...(member.ancestors || [])].reverse(); 
    // ancestors are [parent, grandparent, great-grandparent] etc depending on implementation. 
    // We evaluate rules for each of these members based on their position.

    const batch = this.db.batch();
    let totalCalculated = 0;

    for (const memId of eligibleMembers) {
      const memDoc = await this.db.collection('network_members').doc(memId).get();
      if (!memDoc.exists) continue;
      const memData = memDoc.data() as NetworkMember;

      // Find the best rule for this member's position
      const bestRule = rules.find(r => 
        (r.positionId === memData.positionId || !r.positionId) &&
        (r.networkMemberId === memData.id || !r.networkMemberId)
      );

      if (bestRule) {
        let amount = 0;
        if (bestRule.commissionType === 'PERCENTAGE' && bestRule.percentage) {
          amount = (booking.finalSaleAmount * bestRule.percentage) / 100;
        } else if (bestRule.commissionType === 'FIXED_AMOUNT' && bestRule.fixedAmount) {
          amount = bestRule.fixedAmount;
        }
        
        if (amount > 0) {
          const recordRef = this.db.collection('commission_records').doc();
          const record: CommissionRecord = {
            id: recordRef.id,
            poolId: pool.id,
            bookingId: booking.id,
            projectId: booking.projectId,
            plotId: booking.plotId,
            networkMemberId: memData.id,
            positionId: memData.positionId,
            ruleId: bestRule.id,
            saleValue: booking.finalSaleAmount,
            percentageApplied: bestRule.percentage,
            fixedAmountApplied: bestRule.fixedAmount,
            amount,
            status: 'PENDING',
            calculatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          batch.set(recordRef, record);
          totalCalculated += amount;
        }
      }
    }

    pool.totalCommissionCalculated = totalCalculated;
    batch.set(poolRef, pool);
    
    await batch.commit();
    console.log(`Calculated commission for booking ${bookingId}: Total ${totalCalculated}`);
  }
}
