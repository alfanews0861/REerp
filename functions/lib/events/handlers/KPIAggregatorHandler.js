"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.KPIAggregatorHandler = void 0;
const admin = __importStar(require("firebase-admin"));
const KPIRefs_1 = require("../../utils/KPIRefs");
class KPIAggregatorHandler {
    eventType = 'ALL_KPI_EVENTS';
    async handle(event) {
        const db = admin.firestore();
        const { companyId, projectId } = event.metadata;
        const dateIso = event.timestamp;
        if (!companyId) {
            console.warn(`[KPIAggregator] Ignoring event ${event.eventId} (no companyId)`);
            return;
        }
        const docRefs = [
            KPIRefs_1.KPIRefs.getCompanyGlobalRef(db, companyId),
            KPIRefs_1.KPIRefs.getDailyRef(db, companyId, dateIso)
        ];
        if (projectId) {
            docRefs.push(KPIRefs_1.KPIRefs.getProjectRef(db, companyId, projectId));
            docRefs.push(KPIRefs_1.KPIRefs.getProjectDailyRef(db, companyId, projectId, dateIso));
        }
        const increments = this.getIncrementsForEvent(event);
        if (Object.keys(increments).length === 0)
            return;
        try {
            await db.runTransaction(async (transaction) => {
                // Idempotency Check: We check the global processed events tracker for this company
                const idempotencyRef = KPIRefs_1.KPIRefs.getCompanyGlobalRef(db, companyId).collection('processed_events').doc(event.eventId);
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
        }
        catch (error) {
            console.error(`[KPIAggregator] Transaction failed for event ${event.eventId}:`, error);
            throw error;
        }
    }
    getIncrementsForEvent(event) {
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
            case 'PAYMENT_RECEIVED': {
                const amount = event.payload.amount || 0;
                return {
                    collectedAmount: FieldValue.increment(amount),
                    outstandingAmount: FieldValue.increment(-amount)
                };
            }
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
exports.KPIAggregatorHandler = KPIAggregatorHandler;
//# sourceMappingURL=KPIAggregatorHandler.js.map