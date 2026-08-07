import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const onTeamUpdated = functions.firestore
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
