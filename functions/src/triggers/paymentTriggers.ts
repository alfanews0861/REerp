import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';
import { PlotBooking } from '@real-estate-erp/types';
import { DefaultEventPublisher, BookingPaymentEvents } from '@real-estate-erp/events';
import { FirestoreEventStore } from '@real-estate-erp/events/src/store/FirestoreEventStore';

export const handlePaymentUpdated = async (event: any) => {
    const before = event.data?.before.data() as PlotBooking;
    const after = event.data?.after.data() as PlotBooking;
    if (!before || !after) return;

    // Check if the payment schedule has changed and if all payments are now paid
    const wasFullyPaid = before.paymentSchedule.every((p: any) => p.status === 'PAID' && p.amountPaid >= p.amountDue);
    const isFullyPaid = after.paymentSchedule.every((p: any) => p.status === 'PAID' && p.amountPaid >= p.amountDue);

    if (!wasFullyPaid && isFullyPaid) {
      // The booking just became fully paid
      const store = new FirestoreEventStore(admin.firestore());
      const publisher = new DefaultEventPublisher(store);
      
      const evt = {
        eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        aggregateId: after.id,
        aggregateType: 'Booking' as any,
        eventType: BookingPaymentEvents.BOOKING_FULLY_PAID as any,
        payload: {
          bookingId: after.id,
          projectId: after.projectId,
          finalSaleAmount: after.finalSaleAmount
        },
        actor: 'SYSTEM',
        metadata: {},
        timestamp: new Date().toISOString(),
        version: 1
      };
      
      await publisher.publish(evt);
      console.log(`Published BOOKING_FULLY_PAID for booking ${after.id}`);
    }
};

export const onPaymentUpdated = onDocumentUpdated(
  {
    document: 'bookings/{bookingId}',
    region: 'asia-south1'
  },
  handlePaymentUpdated
);

