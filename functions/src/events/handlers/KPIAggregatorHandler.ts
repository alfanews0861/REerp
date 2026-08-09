import * as admin from 'firebase-admin';
import { EventHandler, Event } from '@real-estate-erp/events';
import { KPIRefs } from '../../utils/KPIRefs';
import { CommandCenterKPIs } from '@real-estate-erp/types';

// Extend base event to expect common dimensions where possible
interface DimensionedEvent extends Event {
  metadata: {
    companyId: string;
    branchId?: string;
    projectId?: string;
    [key: string]: any;
  };
  payload: any;
}

export class KPIAggregatorHandler implements EventHandler<DimensionedEvent> {
  readonly eventType = 'ALL_KPI_EVENTS';
  async handle(event: DimensionedEvent): Promise<void> {
    const db = admin.firestore();
    const { companyId, projectId } = event.metadata;
    const dateIso = event.timestamp;
    
    if (!companyId) {
      console.warn(`[KPIAggregator] Ignoring event ${event.eventId} (no companyId)`);
      return;
    }

    const docRefs = [
      KPIRefs.getCompanyGlobalRef(db, companyId),
      KPIRefs.getDailyRef(db, companyId, dateIso)
    ];

    if (projectId) {
      docRefs.push(KPIRefs.getProjectRef(db, companyId, projectId));
      docRefs.push(KPIRefs.getProjectDailyRef(db, companyId, projectId, dateIso));
    }

    const increments = this.getIncrementsForEvent(event);
    if (Object.keys(increments).length === 0) return;

    try {
      await db.runTransaction(async (transaction) => {
        // Idempotency Check: We check the global processed events tracker for this company
        const idempotencyRef = KPIRefs.getCompanyGlobalRef(db, companyId).collection('processed_events').doc(event.eventId);
        const processedDoc = await transaction.get(idempotencyRef);
        
        if (processedDoc.exists) {
          console.log(`[KPIAggregator] Event ${event.eventId} already processed. Skipping.`);
          return;
        }

        // Process increments for all applicable dimensions
        for (const ref of docRefs) {
          transaction.set(ref, increments, { merge: true });
        }

        // Mark as processed
        transaction.set(idempotencyRef, { 
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
          eventType: event.eventType 
        });
      });
    } catch (error) {
      console.error(`[KPIAggregator] Transaction failed for event ${event.eventId}:`, error);
      throw error;
    }
  }

  private getIncrementsForEvent(event: DimensionedEvent): Partial<Record<keyof CommandCenterKPIs, admin.firestore.FieldValue>> {
    const FieldValue = admin.firestore.FieldValue;
    const inc1 = FieldValue.increment(1);
    const dec1 = FieldValue.increment(-1);
    
    switch (event.eventType) {
      // Marketing
      case 'LEAD_CAPTURED':
        return { totalLeads: inc1 };
      case 'LEAD_QUALIFIED':
        return { qualifiedLeads: inc1 };
      
      // Field
      case 'SITE_VISIT_COMPLETED':
        return { siteVisits: inc1 };
        
      // Sales & Inventory
      case 'PLOT_BOOKED':
      case 'BOOKING_CREATED':
        return { 
          bookings: inc1, 
          grossSales: FieldValue.increment(event.payload.finalSaleAmount || 0),
          availableInventory: dec1,
          bookedInventory: inc1
        };
      case 'BOOKING_FULLY_PAID':
        return { fullPayments: inc1 };
      case 'PLOT_REGISTERED':
        return { 
          registrations: inc1,
          bookedInventory: dec1,
          registeredInventory: inc1
        };
        
      // Payments
      case 'PAYMENT_RECEIVED':
        const amount = event.payload.amount || 0;
        return { 
          collectedAmount: FieldValue.increment(amount),
          outstandingAmount: FieldValue.increment(-amount)
        };
        
      // Commission
      case 'COMMISSION_APPROVED':
        return { commissionPayable: FieldValue.increment(event.payload.amount || 0) };
        
      // After-Sales
      case 'AFTER_SALES_CREATED':
        return { afterSalesOpenCases: inc1 };
      case 'AFTER_SALES_RESOLVED':
        return { afterSalesOpenCases: dec1 };
        
      default:
        return {};
    }
  }
}
