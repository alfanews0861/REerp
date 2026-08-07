import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onDepartmentCreated = functions.firestore
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
