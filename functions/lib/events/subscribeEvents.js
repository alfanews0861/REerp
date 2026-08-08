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
exports.onEventCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const events_1 = require("@real-estate-erp/events");
// Example Handlers - In a real app, you would import these from feature modules
// import { LeadCreatedHandler } from '../modules/leads/handlers';
// import { NotificationHandler } from '../modules/notifications/handlers';
const CommissionHandler_1 = require("./handlers/CommissionHandler");
const dispatcher = new events_1.EventDispatcher();
// Register handlers
dispatcher.subscribe('BOOKING_FULLY_PAID', new CommissionHandler_1.CommissionHandler());
exports.onEventCreated = functions.firestore
    .document('events/{eventId}')
    .onCreate(async (snapshot, _context) => {
    const eventData = snapshot.data();
    // Convert Firestore Timestamp back to ISO string if necessary,
    // though the Event object should already be well-formed from publisher.
    const event = {
        ...eventData,
        timestamp: eventData.timestamp.toDate().toISOString(),
    };
    try {
        console.log(`Dispatching event: ${event.eventType} for aggregate: ${event.aggregateId}`);
        await dispatcher.dispatch(event);
    }
    catch (error) {
        console.error(`Failed to process event ${event.eventId}:`, error);
        // In a production system, you'd integrate the EventRetryService and DLQRepository here.
        // E.g., await retryService.executeWithRetry(dispatcher, event);
        // Or throw so Firebase can retry if retry is enabled on the function.
        throw error;
    }
});
//# sourceMappingURL=subscribeEvents.js.map