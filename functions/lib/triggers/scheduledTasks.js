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
exports.hourlyBookingExpiry = exports.dailySystemCleanup = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
const admin = __importStar(require("firebase-admin"));
const firebase_1 = require("@real-estate-erp/firebase");
// Daily maintenance & system audit log cleanup cron job
exports.dailySystemCleanup = (0, scheduler_1.onSchedule)('every 24 hours', async () => {
    const db = admin.firestore();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const snapshot = await db
        .collection('audit_logs')
        .where('timestamp', '<', thirtyDaysAgo)
        .limit(500)
        .get();
    if (snapshot.empty)
        return;
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
});
// Hourly booking expiry job
exports.hourlyBookingExpiry = (0, scheduler_1.onSchedule)('every 1 hours', async () => {
    const db = admin.firestore();
    const now = new Date().toISOString();
    // Find all BOOKED plots whose expiry has passed
    const snapshot = await db
        .collection('plots')
        .where('status', '==', 'BOOKED')
        .where('bookingExpiryAt', '<', now)
        .get();
    if (snapshot.empty)
        return;
    for (const doc of snapshot.docs) {
        try {
            // Invoke existing service idempotently
            await firebase_1.inventoryBookingService.processBookingExpiry(doc.id, 'system-cron');
        }
        catch (error) {
            console.error(`Error processing expiry for plot ${doc.id}`, error);
        }
    }
});
//# sourceMappingURL=scheduledTasks.js.map