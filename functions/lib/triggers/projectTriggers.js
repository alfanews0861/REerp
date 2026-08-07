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
exports.onPlotPriceChanged = exports.onPlotCreated = exports.onBlockCreated = exports.onLayoutCreated = exports.onProjectCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.onProjectCreated = functions.firestore
    .document('projects/{projectId}')
    .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log(`New Project Created: ${data.name} (${context.params.projectId})`);
    // Log to AuditLogs or send notifications
    await admin.firestore().collection('audit_logs').add({
        action: 'PROJECT_CREATED',
        entityId: context.params.projectId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: { projectName: data.name }
    });
});
exports.onLayoutCreated = functions.firestore
    .document('layouts/{layoutId}')
    .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log(`New Layout Created: ${data.name} (${context.params.layoutId})`);
    await admin.firestore().collection('audit_logs').add({
        action: 'LAYOUT_CREATED',
        entityId: context.params.layoutId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: { layoutName: data.name, projectId: data.projectId }
    });
});
exports.onBlockCreated = functions.firestore
    .document('blocks/{blockId}')
    .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log(`New Block Created: ${data.name} (${context.params.blockId})`);
    await admin.firestore().collection('audit_logs').add({
        action: 'BLOCK_CREATED',
        entityId: context.params.blockId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: { blockName: data.name, layoutId: data.layoutId }
    });
});
exports.onPlotCreated = functions.firestore
    .document('plots/{plotId}')
    .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log(`New Plot Created: ${data.plotNumber} (${context.params.plotId})`);
    await admin.firestore().collection('audit_logs').add({
        action: 'PLOT_CREATED',
        entityId: context.params.plotId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        details: { plotNumber: data.plotNumber, blockId: data.blockId }
    });
});
exports.onPlotPriceChanged = functions.firestore
    .document('plots/{plotId}')
    .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    if (before.price !== after.price) {
        console.log(`Plot ${context.params.plotId} price changed from ${before.price} to ${after.price}`);
        await admin.firestore().collection('audit_logs').add({
            action: 'PLOT_PRICE_CHANGED',
            entityId: context.params.plotId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            details: { oldPrice: before.price, newPrice: after.price }
        });
    }
});
//# sourceMappingURL=projectTriggers.js.map