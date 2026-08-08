import { runTransaction, doc, collection } from 'firebase/firestore';
import { getFirebaseInstance } from '../../config';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { BookingModel, PaymentModel } from '../../models';
import { AggregateType, Event } from '@real-estate-erp/events';

export interface RecordPaymentInput {
  bookingId: string;
  amount: number;
  paymentMethod: 'CASH' | 'CHEQUE' | 'BANK_TRANSFER' | 'UPI' | 'CARD' | 'OTHER';
  transactionRef?: string;
  remarks?: string;
  proofUrl?: string;
}

export class PaymentService {
  /**
   * Records a payment against an active booking.
   * Updates the totalPaidAmount on the booking atomically.
   */
  public async recordPayment(input: RecordPaymentInput, userId: string): Promise<PaymentModel> {
    const { db } = getFirebaseInstance();
    
    const bookingRef = doc(db, FIRESTORE_COLLECTIONS.BOOKINGS, input.bookingId);
    const paymentRef = doc(collection(db, FIRESTORE_COLLECTIONS.PAYMENTS || 'payments'));
    const eventRef = doc(collection(db, 'events')); 
    const auditRef = doc(collection(db, FIRESTORE_COLLECTIONS.AUDIT_LOGS));

    return runTransaction(db, async (transaction) => {
      const bookingDoc = await transaction.get(bookingRef);
      if (!bookingDoc.exists()) {
        throw new Error('BOOKING_NOT_FOUND');
      }

      const booking = bookingDoc.data() as BookingModel;

      if (booking.status !== 'active') {
        throw new Error('BOOKING_NOT_ACTIVE');
      }

      if (input.amount <= 0) {
        throw new Error('INVALID_PAYMENT_AMOUNT');
      }

      const balance = booking.finalAmount - booking.totalPaidAmount;
      if (input.amount > balance) {
        throw new Error('PAYMENT_EXCEEDS_BALANCE');
      }

      const now = new Date().toISOString();
      const newTotalPaid = booking.totalPaidAmount + input.amount;

      // Create Payment Object
      const paymentData: PaymentModel = {
        id: paymentRef.id,
        bookingId: booking.id,
        customerId: booking.customerId,
        companyId: booking.companyId,
        paymentNumber: `PAY-${Date.now()}`,
        amount: input.amount,
        paymentDate: now,
        paymentMethod: input.paymentMethod,
        transactionRef: input.transactionRef,
        status: 'verified', // MVP assumes verification at entry
        remarks: input.remarks,
        proofUrl: input.proofUrl,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        isActive: true,
        isDeleted: false,
        version: 1,
      };

      const isNowFullyPaid = newTotalPaid >= booking.finalAmount;
      const wasAlreadyFullyPaid = booking.totalPaidAmount >= booking.finalAmount;

      const bookingUpdate: any = {
        totalPaidAmount: newTotalPaid,
        updatedAt: now,
        updatedBy: userId,
        version: booking.version + 1,
      };

      if (isNowFullyPaid && !wasAlreadyFullyPaid) {
        bookingUpdate.isFullyPaid = true;
        bookingUpdate.fullyPaidAt = now;
      }

      // Update Booking
      transaction.update(bookingRef, bookingUpdate);

      // Create Event
      const paymentEvent: Event = {
        eventId: eventRef.id,
        aggregateId: booking.id,
        aggregateType: AggregateType.Booking as any, // fallback if not exist
        eventType: 'BOOKING_PAYMENT_RECORDED',
        timestamp: now,
        version: booking.version + 1,
        actor: userId,
        payload: {
          bookingId: booking.id,
          paymentId: paymentData.id,
          amount: input.amount,
          newTotalPaid: newTotalPaid,
          balance: booking.finalAmount - newTotalPaid,
        },
        metadata: {
          source: 'PaymentService',
        }
      };

      transaction.set(paymentRef, paymentData);
      transaction.set(eventRef, {
        ...paymentEvent,
        timestamp: new Date(paymentEvent.timestamp),
      });

      // Emit BOOKING_FULLY_PAID only if this specific payment crossed the threshold
      if (isNowFullyPaid && !wasAlreadyFullyPaid) {
        const fullyPaidEventRef = doc(collection(db, 'events'));
        const fullyPaidEvent: Event = {
          eventId: fullyPaidEventRef.id,
          aggregateId: booking.id,
          aggregateType: AggregateType.Booking as any,
          eventType: 'BOOKING_FULLY_PAID',
          timestamp: now,
          version: booking.version + 2,
          actor: userId,
          payload: {
            bookingId: booking.id,
            totalPaidAmount: newTotalPaid,
            finalAmount: booking.finalAmount,
          },
          metadata: {
            source: 'PaymentService',
            triggerPaymentId: paymentData.id
          }
        };
        transaction.set(fullyPaidEventRef, {
          ...fullyPaidEvent,
          timestamp: new Date(fullyPaidEvent.timestamp),
        });
      }

      // Audit Log
      transaction.set(auditRef, {
        id: auditRef.id,
        action: 'create',
        entityType: 'Payment',
        entityId: paymentData.id,
        userId: userId,
        previousState: null,
        newState: { amount: input.amount, bookingId: booking.id },
        ipAddress: '',
        userAgent: '',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        isActive: true,
        isDeleted: false,
        version: 1,
      });

      return paymentData;
    });
  }
}

export const paymentService = new PaymentService();
