import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

export const handleDepartmentCreated = async (event: any) => {
    const departmentId = event.params.departmentId;
    const deptData = event.data?.data();
    
    if (!deptData) return;

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
};

export const onDepartmentCreated = onDocumentCreated(
  {
    document: 'departments/{departmentId}',
    region: 'asia-south1'
  },
  handleDepartmentCreated
);

