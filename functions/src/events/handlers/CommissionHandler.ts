import { EventHandler, Event } from '@real-estate-erp/events';
import * as admin from 'firebase-admin';
import { CommissionService } from '@real-estate-erp/firebase/src/services/CommissionService';
import { NetworkService } from '@real-estate-erp/firebase/src/services/NetworkService';
import {
  AdminCommissionPoolRepository,
  AdminCommissionRecordRepository,
  AdminCommissionRuleRepository,
  AdminNetworkMemberRepository
} from '../../repositories/AdminCommissionRepositories';

export class CommissionHandler implements EventHandler {
  public eventType = 'BOOKING_FULLY_PAID';

  async handle(event: Event): Promise<void> {
    if (event.eventType === 'BOOKING_FULLY_PAID') {
      const { bookingId } = event.payload;
      if (bookingId) {
        console.log(`CommissionHandler processing BOOKING_FULLY_PAID for booking ${bookingId}`);
        const db = admin.firestore();
        const bookingDoc = await db.collection('bookings').doc(bookingId).get();
        if (!bookingDoc.exists) return;
        
        const booking = bookingDoc.data() as any;
        const leadDoc = await db.collection('leads').where('personId', '==', booking.customerId).limit(1).get();
        let lead = { ownerId: null, networkMemberId: null } as any;
        if (!leadDoc.empty) {
          lead = leadDoc.docs[0].data();
        } else {
          // If no lead found, maybe it's direct booking, fallback to booking's executive IDs
          lead = { 
            ownerId: booking.salesExecutiveId, 
            networkMemberId: booking.marketingExecutiveId || booking.salesExecutiveId 
          };
        }

        const networkRepo = new AdminNetworkMemberRepository();
        const networkSvc = new NetworkService(networkRepo);

        const commissionSvc = new CommissionService(
          new AdminCommissionRuleRepository(),
          new AdminCommissionPoolRepository(),
          new AdminCommissionRecordRepository(),
          networkSvc,
          networkRepo
        );

        await commissionSvc.calculateCommission(booking, lead, booking.totalAmount || 0, 'SYSTEM');
      }
    }
  }
}
