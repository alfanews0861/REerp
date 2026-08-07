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
exports.onDepartmentCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.onDepartmentCreated = functions.firestore
    .document('departments/{departmentId}')
    .onCreate(async (snap, context) => {
    const departmentId = context.params.departmentId;
    const deptData = snap.data();
    console.log(`Department ${departmentId} created for company ${deptData.companyId}`);
    const db = admin.firestore();
    // Audit Log
    const auditRef = db.collection('audit_logs').doc();
    await auditRef.set({
        id: auditRef.id,
        companyId: deptData.companyId,
        userId: deptData.createdBy || 'system',
        entityType: 'Department',
        entityId: departmentId,
        action: 'create',
        newState: deptData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isActive: true,
        isDeleted: false,
        version: 1,
    });
});
//# sourceMappingURL=onDepartmentCreated.js.map