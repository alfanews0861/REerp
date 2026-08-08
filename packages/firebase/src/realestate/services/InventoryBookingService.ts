import { runTransaction, doc, collection } from 'firebase/firestore';
import { getFirebaseInstance } from '../../config';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { PlotModel, BookingModel } from '../../models';
import { AggregateType, Event } from '@real-estate-erp/events';

export interface BookPlotInput {
  plotId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  salesExecutiveId: string;
  salesExecutiveName: string;
  branchId: string;
  projectId: string;
  projectName: string;
  plotNumber: string;
  plotSizeSqFt: number;
  agreedPricePerSqFt: number;
  totalPlotAmount: number;
  discountAmount: number;
  finalSaleAmount: number;
}

export class InventoryBookingService {
  /**
   * Safely books a plot using a Firestore transaction to prevent concurrent bookings.
   * Ensures exactly-one semantic: if two users book the same plot, only one succeeds.
   */
  public async bookPlot(input: BookPlotInput, userId: string): Promise<BookingModel> {
    const { db } = getFirebaseInstance();
    
    const plotRef = doc(db, FIRESTORE_COLLECTIONS.PLOTS, input.plotId);
    const bookingRef = doc(collection(db, FIRESTORE_COLLECTIONS.BOOKINGS));
    const eventRef = doc(collection(db, 'events')); // Internal events collection
    const auditRef = doc(collection(db, FIRESTORE_COLLECTIONS.AUDIT_LOGS));

    return runTransaction(db, async (transaction) => {
      const plotDoc = await transaction.get(plotRef);
      if (!plotDoc.exists()) {
        throw new Error('PLOT_NOT_FOUND');
      }

      const plot = plotDoc.data() as PlotModel;

      if (!plot.isAvailable || plot.status !== 'AVAILABLE') {
        throw new Error('PLOT_NOT_AVAILABLE');
      }

      const now = new Date().toISOString();
      const expiryHours = plot.bookingExpiryDurationHours || 48; // Default 48h
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + expiryHours);

      // Create Booking object
      const bookingData: BookingModel = {
        id: bookingRef.id,
        bookingNumber: `BKG-${Date.now()}`,
        projectId: input.projectId,
        layoutId: '',
        blockId: '',
        plotId: input.plotId,
        customerId: input.customerId,
        agentId: input.salesExecutiveId,
        branchId: input.branchId,
        companyId: 'default',
        bookingDate: now,
        totalAmount: input.totalPlotAmount,
        discountAmount: input.discountAmount,
        finalAmount: input.finalSaleAmount,
        tokenAmount: 0,
        paymentPlanType: 'outright',
        status: 'draft',
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        updatedBy: userId,
        isActive: true,
        isDeleted: false,
        version: 1,
      };

      // Update plot
      const updatedPlot: Partial<PlotModel> = {
        status: 'BOOKED',
        isAvailable: false,
        currentBookingId: bookingRef.id,
        bookingExpiryAt: expiryDate.toISOString(),
        updatedAt: now,
        updatedBy: userId,
        version: plot.version + 1,
      };

      // Create event
      const bookingEvent: Event = {
        eventId: eventRef.id,
        aggregateId: input.plotId,
        aggregateType: AggregateType.Plot,
        eventType: 'PLOT_BOOKED',
        timestamp: now,
        version: plot.version + 1,
        actor: userId,
        payload: {
          plotId: input.plotId,
          bookingId: bookingRef.id,
          customerId: input.customerId,
        },
        metadata: {
          source: 'InventoryBookingService',
        }
      };

      // Execute writes
      transaction.set(bookingRef, bookingData);
      transaction.update(plotRef, updatedPlot);
      
      // Store event with Date timestamp as required by FirestoreEventStore
      transaction.set(eventRef, {
        ...bookingEvent,
        timestamp: new Date(bookingEvent.timestamp),
      });

      // Audit Log
      transaction.set(auditRef, {
        id: auditRef.id,
        action: 'create',
        entityType: 'Plot',
        entityId: input.plotId,
        userId: userId,
        previousState: { status: plot.status, isAvailable: plot.isAvailable },
        newState: { status: 'BOOKED', isAvailable: false },
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

      return bookingData;
    });
  }

  /**
   * Process booking expiry for a plot. Can be called by a cron job or lazily on read.
   */
  public async processBookingExpiry(plotId: string, systemUserId: string = 'system'): Promise<void> {
    const { db } = getFirebaseInstance();
    const plotRef = doc(db, FIRESTORE_COLLECTIONS.PLOTS, plotId);
    const eventRef = doc(collection(db, 'events'));
    const auditRef = doc(collection(db, FIRESTORE_COLLECTIONS.AUDIT_LOGS));

    await runTransaction(db, async (transaction) => {
      const plotDoc = await transaction.get(plotRef);
      if (!plotDoc.exists()) {
        throw new Error('PLOT_NOT_FOUND');
      }

      const plot = plotDoc.data() as PlotModel;

      if (plot.status !== 'BOOKED') {
        return; // Nothing to expire
      }

      if (plot.bookingExpiryAt && new Date(plot.bookingExpiryAt) > new Date()) {
        return; // Not yet expired
      }

      const now = new Date().toISOString();

      const updatedPlot: Partial<PlotModel> = {
        status: 'AVAILABLE',
        isAvailable: true,
        currentBookingId: '', // Clear booking
        bookingExpiryAt: '',
        updatedAt: now,
        updatedBy: systemUserId,
        version: plot.version + 1,
      };

      transaction.update(plotRef, updatedPlot);

      if (plot.currentBookingId) {
        const bookingRef = doc(db, FIRESTORE_COLLECTIONS.BOOKINGS, plot.currentBookingId);
        transaction.update(bookingRef, {
          status: 'cancelled',
          notes: 'Automatically expired',
          updatedAt: now,
          updatedBy: systemUserId,
        });
      }

      const expiryEvent: Event = {
        eventId: eventRef.id,
        aggregateId: plotId,
        aggregateType: AggregateType.Plot,
        eventType: 'PLOT_BOOKING_EXPIRED',
        timestamp: now,
        version: plot.version + 1,
        actor: systemUserId,
        payload: { plotId },
        metadata: { source: 'InventoryBookingService' }
      };

      transaction.set(eventRef, {
        ...expiryEvent,
        timestamp: new Date(expiryEvent.timestamp),
      });

      transaction.set(auditRef, {
        id: auditRef.id,
        action: 'update',
        entityType: 'Plot',
        entityId: plotId,
        userId: systemUserId,
        previousState: { status: 'BOOKED', isAvailable: false },
        newState: { status: 'AVAILABLE', isAvailable: true },
        ipAddress: '',
        userAgent: '',
        createdAt: now,
        updatedAt: now,
        createdBy: systemUserId,
        updatedBy: systemUserId,
        isActive: true,
        isDeleted: false,
        version: 1,
      });
    });
  }
}

export const inventoryBookingService = new InventoryBookingService();
