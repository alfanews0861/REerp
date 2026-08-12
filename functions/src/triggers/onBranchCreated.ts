import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

export const handleBranchCreated = async (event: any) => {
    const branchData = event.data?.data();
    if (!branchData) return;
    const branchId = event.params.branchId;
    
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
};

export const onBranchCreated = onDocumentCreated(
  {
    document: 'branches/{branchId}',
    region: 'asia-south1'
  },
  handleBranchCreated
);

