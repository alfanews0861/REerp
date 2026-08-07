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
exports.onUserDeleted = exports.onUserProfileUpdated = exports.onUserCreated = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const authV1 = __importStar(require("firebase-functions/v1/auth"));
const admin = __importStar(require("firebase-admin"));
// Default permissions matrix for backend claims sync
const DEFAULT_ROLE_PERMISSIONS = {
    super_admin: ['*:*'],
    director: ['company:*', 'branch:*', 'employee:*', 'attendance:*', 'campaign:*', 'lead:*', 'followup:*', 'project:*', 'layout:*', 'plot:*', 'booking:*', 'customer:*', 'payments:*', 'vehicle:*', 'expenses:*', 'reports:*', 'dashboard:*', 'settings:*', 'notifications:*', 'ai:*'],
    branch_manager: ['branch:read', 'branch:update', 'employee:read', 'employee:update', 'attendance:*', 'campaign:read', 'lead:*', 'followup:*', 'project:read', 'layout:read', 'plot:read', 'plot:update', 'booking:*', 'customer:*', 'payments:read', 'payments:approve', 'vehicle:read', 'expenses:*', 'reports:*', 'dashboard:*', 'notifications:*'],
    marketing_manager: ['campaign:*', 'lead:*', 'followup:*', 'reports:read', 'reports:export', 'dashboard:read', 'notifications:*', 'ai:*'],
    marketing_executive: ['campaign:read', 'campaign:update', 'lead:create', 'lead:read', 'lead:update', 'lead:import', 'followup:create', 'followup:read', 'followup:update', 'dashboard:read', 'notifications:read'],
    sales_manager: ['lead:*', 'followup:*', 'project:read', 'layout:read', 'plot:read', 'plot:update', 'booking:*', 'customer:*', 'reports:read', 'dashboard:read', 'notifications:*'],
    sales_executive: ['lead:read', 'lead:update', 'followup:create', 'followup:read', 'followup:update', 'project:read', 'layout:read', 'plot:read', 'booking:create', 'booking:read', 'booking:update', 'customer:create', 'customer:read', 'customer:update', 'dashboard:read', 'notifications:read'],
    telecaller: ['lead:create', 'lead:read', 'lead:update', 'followup:create', 'followup:read', 'followup:update', 'customer:read', 'dashboard:read', 'notifications:read'],
    accountant: ['payments:*', 'expenses:*', 'reports:*', 'booking:read', 'booking:update', 'customer:read', 'dashboard:read', 'notifications:*'],
    driver: ['vehicle:read', 'vehicle:update', 'attendance:create', 'attendance:read', 'dashboard:read', 'notifications:read'],
    customer: ['dashboard:read', 'booking:read', 'payments:read', 'customer:read', 'customer:update', 'notifications:read'],
};
// 1. Auto create user profile & assign default role on User Creation
exports.onUserCreated = functions.identity.beforeUserCreated(async (event) => {
    const user = event.data;
    const db = admin.firestore();
    const defaultRole = 'customer';
    const permissions = DEFAULT_ROLE_PERMISSIONS[defaultRole] || [];
    if (user) {
        // Write initial UserProfile in Firestore
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            phoneNumber: user.phoneNumber || null,
            photoURL: user.photoURL || null,
            role: defaultRole,
            status: 'active',
            permissions: permissions,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    return {
        customClaims: {
            role: defaultRole,
            permissions: permissions,
            admin: false,
        },
    };
});
// 2. Auto Sync Custom Claims on Firestore User Document write/update
exports.onUserProfileUpdated = functions.firestore.onDocumentWritten('users/{uid}', async (event) => {
    const uid = event.params.uid;
    const afterData = event.data?.after.data();
    if (!afterData)
        return;
    const role = afterData.role || 'customer';
    const customPermissions = afterData.permissions || [];
    const basePermissions = DEFAULT_ROLE_PERMISSIONS[role] || [];
    const combinedPermissions = Array.from(new Set([...basePermissions, ...customPermissions]));
    const claims = {
        role,
        permissions: combinedPermissions,
        tenantId: afterData.tenantId || null,
        admin: role === 'super_admin',
    };
    await admin.auth().setCustomUserClaims(uid, claims);
});
// 3. Deactivate deleted users and revoke refresh tokens
exports.onUserDeleted = authV1.user().onDelete(async (user) => {
    const db = admin.firestore();
    // Mark Firestore profile as inactive / suspended
    await db.collection('users').doc(user.uid).set({
        status: 'inactive',
        deletedAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    // Revoke refresh tokens
    await admin.auth().revokeRefreshTokens(user.uid);
});
//# sourceMappingURL=authTriggers.js.map