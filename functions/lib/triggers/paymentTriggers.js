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
exports.onPaymentUpdated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const events_1 = require("@repo/events");
const events_2 = require("@repo/events");
exports.onPaymentUpdated = functions.firestore
    .document('bookings/{bookingId}')
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    // Check if the payment schedule has changed and if all payments are now paid
    const wasFullyPaid = before.paymentSchedule.every(p => p.status === 'PAID' && p.amountPaid >= p.amountDue);
    const isFullyPaid = after.paymentSchedule.every(p => p.status === 'PAID' && p.amountPaid >= p.amountDue);
    if (!wasFullyPaid && isFullyPaid) {
        // The booking just became fully paid
        const publisher = new events_1.EventPublisher(admin.firestore());
        await publisher.publish({
            aggregateId: after.id,
            aggregateType: 'Booking', // Cast since we added it to types but EventPublisher might have old type definition cached in memory during build
            eventType: events_2.BookingPaymentEvents.BOOKING_FULLY_PAID,
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
//# sourceMappingURL=paymentTriggers.js.map