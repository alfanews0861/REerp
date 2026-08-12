import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as admin from 'firebase-admin';

export const handleTeamUpdated = async (event: any) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
    if (!beforeData || !afterData) return;
    
    const teamId = event.params.teamId;
    
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
};

export const onTeamUpdated = onDocumentUpdated(
  {
    document: 'teams/{teamId}',
    region: 'asia-south1'
  },
  handleTeamUpdated
);

