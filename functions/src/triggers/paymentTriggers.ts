import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { PlotBooking } from '@real-estate-erp/types';
import { EventPublisher } from '@real-estate-erp/events';
import { BookingPaymentEvents } from '@real-estate-erp/events';

export const onPaymentUpdated = functions.firestore
  .document('bookings/{bookingId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data() as PlotBooking;
    const after = change.after.data() as PlotBooking;

    // Check if the payment schedule has changed and if all payments are now paid
    const wasFullyPaid = before.paymentSchedule.every((p: any) => p.status === 'PAID' && p.amountPaid >= p.amountDue);
    const isFullyPaid = after.paymentSchedule.every((p: any) => p.status === 'PAID' && p.amountPaid >= p.amountDue);

    if (!wasFullyPaid && isFullyPaid) {
      // The booking just became fully paid
      const publisher = new EventPublisher(admin.firestore());
      await publisher.publish({
        aggregateId: after.id,
        aggregateType: 'Booking' as any, // Cast since we added it to types but EventPublisher might have old type definition cached in memory during build
        eventType: BookingPaymentEvents.BOOKING_FULLY_PAID,
        payload: {
          bookingId: after.id,
          projectId: after.projectId,
          finalSaleAmount: after.finalSaleAmount
        },
        actor: 'SYSTEM',
        metadata: {}
      });
      console.log(`Published BOOKING_FULLY_PAID for booking ${after.id}`);
    }
  });
