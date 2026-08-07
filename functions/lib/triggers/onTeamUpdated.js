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
exports.onTeamUpdated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.onTeamUpdated = functions.firestore
    .document('teams/{teamId}')
    .onUpdate(async (change, context) => {
    const teamId = context.params.teamId;
    const beforeData = change.before.data();
    const afterData = change.after.data();
    console.log(`Team ${teamId} updated`);
    const db = admin.firestore();
    const batch = db.batch();
    // Check if memberIds changed
    const beforeMembers = new Set(beforeData.memberIds || []);
    const afterMembers = new Set(afterData.memberIds || []);
    const addedMembers = [...afterMembers].filter(m => !beforeMembers.has(m));
    const removedMembers = [...beforeMembers].filter(m => !afterMembers.has(m));
    // Optional: We could sync this to user profiles, e.g. adding teamId to a user's `teamIds` array.
    // For now, we will log it.
    if (addedMembers.length > 0 || removedMembers.length > 0) {
        console.log(`Team ${teamId} members changed. Added: ${addedMembers.join(',')}, Removed: ${removedMembers.join(',')}`);
    }
    // Audit Log
    const auditRef = db.collection('audit_logs').doc();
    batch.set(auditRef, {
        id: auditRef.id,
        companyId: afterData.companyId,
        userId: afterData.updatedBy || 'system',
        entityType: 'Team',
        entityId: teamId,
        action: 'update',
        previousState: beforeData,
        newState: afterData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isActive: true,
        isDeleted: false,
        version: 1,
    });
    await batch.commit();
});
//# sourceMappingURL=onTeamUpdated.js.map