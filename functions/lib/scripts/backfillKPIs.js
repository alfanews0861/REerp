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
exports.backfillKPIs = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
/**
 * Checkpointed backfill function to rebuild KPI materialized views from source records.
 * Can be invoked repeatedly safely as it uses idempotent deterministic aggregations (overwriting state)
 * if run as a full sweep, but since it's pagination-based, we use increment to add to existing totals
 * and use a cursor. To truly reset, the `dashboard_kpis` should be cleared before running the sweep.
 */
exports.backfillKPIs = functions.https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Only admins can run backfills');
    }
    const { companyId, collectionName, batchSize = 500, lastProcessedId } = data;
    if (!companyId || !collectionName) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing companyId or collectionName');
    }
    const db = admin.firestore();
    let query = db.collection(collectionName)
        .where('companyId', '==', companyId)
        .orderBy('__name__')
        .limit(batchSize);
    if (lastProcessedId) {
        const lastDoc = await db.collection(collectionName).doc(lastProcessedId).get();
        if (lastDoc.exists) {
            query = query.startAfter(lastDoc);
        }
    }
    const snapshot = await query.get();
    if (snapshot.empty) {
        return { status: 'completed', message: `No more documents to process for ${collectionName}` };
    }
    let processedCount = 0;
    let lastId = '';
    // Aggregate in memory per batch
    const increments = {};
    snapshot.docs.forEach(docSnap => {
        const docData = docSnap.data();
        lastId = docSnap.id;
        processedCount++;
        const dateIso = docData.createdAt || new Date().toISOString();
        const projectId = docData.projectId;
        const refs = [
            `${companyId}_global`,
            `${companyId}_daily_${dateIso.split('T')[0]}`
        ];
        if (projectId) {
            refs.push(`${companyId}_project_${projectId}`);
            refs.push(`${companyId}_project_${projectId}_daily_${dateIso.split('T')[0]}`);
        }
        refs.forEach(refId => {
            if (!increments[refId])
                increments[refId] = {};
            const inc = increments[refId];
            if (collectionName === 'leads') {
                inc.totalLeads = (inc.totalLeads || 0) + 1;
                if (docData.status === 'QUALIFIED')
                    inc.qualifiedLeads = (inc.qualifiedLeads || 0) + 1;
            }
            else if (collectionName === 'siteVisits') {
                if (docData.status === 'COMPLETED')
                    inc.siteVisits = (inc.siteVisits || 0) + 1;
            }
            else if (collectionName === 'bookings') {
                inc.bookings = (inc.bookings || 0) + 1;
                inc.grossSales = (inc.grossSales || 0) + (docData.finalSaleAmount || 0);
                inc.bookedInventory = (inc.bookedInventory || 0) + 1;
                if (docData.status === 'REGISTERED') {
                    inc.registrations = (inc.registrations || 0) + 1;
                    inc.registeredInventory = (inc.registeredInventory || 0) + 1;
                }
            }
            else if (collectionName === 'after_sales') {
                if (docData.status !== 'RESOLVED' && docData.status !== 'CLOSED') {
                    inc.afterSalesOpenCases = (inc.afterSalesOpenCases || 0) + 1;
                }
            }
        });
    });
    // Write increments transactionally in batches
    const batch = db.batch();
    for (const [refId, incData] of Object.entries(increments)) {
        const docRef = db.collection('dashboard_kpis').doc(refId);
        // Convert numbers to FieldValue.increment
        const firestoreIncrements = {};
        for (const [key, val] of Object.entries(incData)) {
            if (val)
                firestoreIncrements[key] = admin.firestore.FieldValue.increment(val);
        }
        if (Object.keys(firestoreIncrements).length > 0) {
            batch.set(docRef, firestoreIncrements, { merge: true });
        }
    }
    await batch.commit();
    return {
        status: 'partial',
        processedCount,
        lastProcessedId: lastId,
        message: `Processed ${processedCount} records from ${collectionName}`
    };
});
//# sourceMappingURL=backfillKPIs.js.map