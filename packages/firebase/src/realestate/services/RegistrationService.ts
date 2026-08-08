import { runTransaction, doc, collection } from 'firebase/firestore';
import { getFirebaseInstance } from '../../config';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { BookingModel, PlotModel, RegistrationModel } from '../../models';
import { AggregateType, Event } from '@real-estate-erp/events';

export interface CompleteRegistrationInput {
  bookingId: string;
  registrationNumber: string;
  registrationDate: string;
  documents: { type: string; url: string; verified: boolean }[];
  notes?: string;
}

export class RegistrationService {
  /**
   * Completes registration for a booking.
   * Ensures balance is zero, changes plot status to REGISTERED,
   * closes booking, and creates immutable registration record.
   */
  public async completeRegistration(input: CompleteRegistrationInput, userId: string): Promise<RegistrationModel> {
    const { db } = getFirebaseInstance();
    
    const bookingRef = doc(db, FIRESTORE_COLLECTIONS.BOOKINGS, input.bookingId);
    const registrationRef = doc(collection(db, FIRESTORE_COLLECTIONS.REGISTRATIONS || 'registrations'));
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

      const balance = booking.finalAmount - booking.totalPaidAmount;
      if (balance > 0) {
        throw new Error('OUTSTANDING_BALANCE_EXISTS');
      }

      // Check configured documents (mock requirement for MVP: at least one verified document)
      if (!input.documents || input.documents.filter(d => d.verified).length === 0) {
         throw new Error('MISSING_REQUIRED_DOCUMENTS');
      }

      const plotRef = doc(db, FIRESTORE_COLLECTIONS.PLOTS, booking.plotId);
      const plotDoc = await transaction.get(plotRef);
      if (!plotDoc.exists()) {
        throw new Error('PLOT_NOT_FOUND');
      }

      const plot = plotDoc.data() as PlotModel;
      
      if (plot.status !== 'BOOKED') {
        throw new Error('PLOT_NOT_BOOKED');
      }

      const now = new Date().toISOString();

      // Create Registration Object
      const registrationData: RegistrationModel = {
        id: registrationRef.id,
        bookingId: booking.id,
        plotId: booking.plotId,
        customerId: booking.customerId,
        projectId: booking.projectId,
        layoutId: booking.layoutId,
        registrationNumber: input.registrationNumber,
        registrationDate: input.registrationDate || now,
        finalAgreedAmount: booking.finalAmount,
        documents: input.documents,
        actorId: userId,
        notes: input.notes,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        isActive: true,
        isDeleted: false,
        version: 1,
      };

      // Update Booking
      transaction.update(bookingRef, {
        status: 'completed',
        updatedAt: now,
        updatedBy: userId,
        version: booking.version + 1,
      });

      // Update Plot
      transaction.update(plotRef, {
        status: 'REGISTERED',
        isAvailable: false,
        updatedAt: now,
        updatedBy: userId,
        version: plot.version + 1,
      });

      // Create Event
      const registrationEvent: Event = {
        eventId: eventRef.id,
        aggregateId: plot.id,
        aggregateType: AggregateType.Plot,
        eventType: 'PLOT_REGISTERED',
        timestamp: now,
        version: plot.version + 1,
        actor: userId,
        payload: {
          plotId: plot.id,
          bookingId: booking.id,
          registrationId: registrationData.id,
        },
        metadata: {
          source: 'RegistrationService',
        }
      };

      transaction.set(registrationRef, registrationData);
      transaction.set(eventRef, {
        ...registrationEvent,
        timestamp: new Date(registrationEvent.timestamp),
      });

      // Audit Log
      transaction.set(auditRef, {
        id: auditRef.id,
        action: 'create',
        entityType: 'Plot',
        entityId: plot.id,
        userId: userId,
        previousState: { status: 'BOOKED', isAvailable: false },
        newState: { status: 'REGISTERED', isAvailable: false },
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

      return registrationData;
    });
  }
}

export const registrationService = new RegistrationService();
