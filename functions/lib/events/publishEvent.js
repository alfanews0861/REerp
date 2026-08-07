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
exports.publishEvent = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const crypto = __importStar(require("crypto"));
const events_1 = require("@real-estate-erp/events");
const db = admin.firestore();
const eventStore = new events_1.FirestoreEventStore(db);
const eventPublisher = new events_1.DefaultEventPublisher(eventStore);
exports.publishEvent = functions.https.onCall(async (data, context) => {
    // Validate authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to publish events.');
    }
    // Construct the full Event object
    const event = {
        eventId: crypto.randomUUID(),
        aggregateId: data.aggregateId,
        aggregateType: data.aggregateType,
        eventType: data.eventType,
        timestamp: new Date().toISOString(),
        version: data.version || 1, // Optional logic to determine next version
        actor: context.auth.uid,
        payload: data.payload,
        metadata: {
            ...data.metadata,
            sourceIp: context.rawRequest.ip,
        },
    };
    // Validate the event structure
    try {
        events_1.EventSchema.parse(event);
    }
    catch (error) {
        throw new functions.https.HttpsError('invalid-argument', 'Event payload does not match schema.', error);
    }
    try {
        await eventPublisher.publish(event);
        return { success: true, eventId: event.eventId };
    }
    catch (error) {
        console.error('Error publishing event:', error);
        throw new functions.https.HttpsError('internal', 'Failed to publish event.', error.message);
    }
});
//# sourceMappingURL=publishEvent.js.map