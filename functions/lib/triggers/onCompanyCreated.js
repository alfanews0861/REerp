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
exports.onCompanyCreated = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
exports.onCompanyCreated = functions.firestore
    .document('companies/{companyId}')
    .onCreate(async (snap, context) => {
    const companyId = context.params.companyId;
    const companyData = snap.data();
    console.log(`Setting up default organization configuration for company ${companyId}`);
    const db = admin.firestore();
    const batch = db.batch();
    // 1. Create Default Organization Settings
    const settingsRef = db.collection('organization_settings').doc();
    batch.set(settingsRef, {
        id: settingsRef.id,
        companyId,
        currency: { code: 'INR', symbol: '₹' },
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        fiscalYearStartMonth: 4,
        taxSettings: {
            gstEnabled: true,
            panRequired: true,
            reraRequired: true,
        },
        features: {
            enabledModules: ['company', 'branch', 'department', 'team', 'leads', 'sales', 'projects'],
        },
        notifications: {
            emailNotifications: true,
            smsNotifications: false,
            whatsappNotifications: false,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isActive: true,
        isDeleted: false,
        version: 1,
    });
    // 2. Default Departments
    const standardDepartments = [
        { name: 'Marketing', code: 'MKT', type: 'marketing', description: 'Marketing & Promotions' },
        { name: 'Sales', code: 'SLS', type: 'sales', description: 'Direct & Channel Sales' },
        { name: 'Accounts & Finance', code: 'ACC', type: 'accounts', description: 'Financial & Accounting Management' },
        { name: 'Human Resources', code: 'HR', type: 'hr', description: 'HR & Personnel Operations' },
    ];
    for (const dept of standardDepartments) {
        const deptRef = db.collection('departments').doc();
        batch.set(deptRef, {
            id: deptRef.id,
            companyId,
            name: dept.name,
            code: dept.code,
            type: dept.type,
            description: dept.description,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            updatedBy: 'system',
            isActive: true,
            isDeleted: false,
            version: 1,
        });
    }
    // 3. Default Designations
    const standardDesignations = [
        { title: 'Chief Executive Officer', code: 'CEO', level: 1 },
        { title: 'General Manager', code: 'GM', level: 2 },
        { title: 'Sales Manager', code: 'SLS_MGR', level: 3 },
        { title: 'Sales Executive', code: 'SLS_EXEC', level: 4 },
        { title: 'Accountant', code: 'ACCT', level: 4 },
    ];
    for (const desig of standardDesignations) {
        const desigRef = db.collection('designations').doc();
        batch.set(desigRef, {
            id: desigRef.id,
            companyId,
            title: desig.title,
            code: desig.code,
            level: desig.level,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            updatedBy: 'system',
            isActive: true,
            isDeleted: false,
            version: 1,
        });
    }
    // 4. Audit Log
    const auditRef = db.collection('audit_logs').doc();
    batch.set(auditRef, {
        id: auditRef.id,
        companyId,
        userId: 'system',
        entityType: 'Company',
        entityId: companyId,
        action: 'create',
        newState: companyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        updatedBy: 'system',
        isActive: true,
        isDeleted: false,
        version: 1,
    });
    await batch.commit();
    console.log(`Default organization configuration setup complete for company ${companyId}`);
});
//# sourceMappingURL=onCompanyCreated.js.map