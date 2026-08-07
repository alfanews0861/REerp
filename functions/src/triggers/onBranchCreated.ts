import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onBranchCreated = functions.firestore
  .document('branches/{branchId}')
  .onCreate(async (snap, context) => {
    const branchId = context.params.branchId;
    const branchData = snap.data();
    
    console.log(`Branch ${branchId} created for company ${branchData.companyId}`);

    const db = admin.firestore();
    
    // Audit Log
    const auditRef = db.collection('audit_logs').doc();
    await auditRef.set({
      id: auditRef.id,
      companyId: branchData.companyId,
      userId: branchData.createdBy || 'system',
      entityType: 'Branch',
      entityId: branchId,
      action: 'create',
      newState: branchData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      updatedBy: 'system',
      isActive: true,
      isDeleted: false,
      version: 1,
    });
  });
