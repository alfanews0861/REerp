import * as functions from 'firebase-functions';


export const onLeadCreated = functions.firestore
  .document('leads/{leadId}')
  .onCreate(async (snap, context) => {
    const leadData = snap.data();
    const leadId = context.params['leadId'];
    console.log(`Lead Created: ${leadId}`, leadData);

    // Additional logic like push notifications, webhook integrations, etc.
  });

export const onLeadUpdated = functions.firestore
  .document('leads/{leadId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const leadId = context.params['leadId'];

    if (before.assignedToUserId !== after.assignedToUserId) {
      console.log(`Lead Assigned: ${leadId} assigned to ${after.assignedToUserId}`);
      // Notify new assignee
    }

    if (before.status !== 'qualified' && after.status === 'qualified') {
      console.log(`Lead Qualified: ${leadId}`);
      // Start qualification workflows
    }
  });
