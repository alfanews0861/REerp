import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';

export const handleLeadCreated = async (event: any) => {
    const leadData = event.data?.data();
    if (!leadData) return;
    const leadId = event.params['leadId'];
    console.log(`Lead Created: ${leadId}`, leadData);

    // Additional logic like push notifications, webhook integrations, etc.
};

export const onLeadCreated = onDocumentCreated(
  {
    document: 'leads/{leadId}',
    region: 'asia-south1'
  },
  handleLeadCreated
);


export const handleLeadUpdated = async (event: any) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!before || !after) return;
    const leadId = event.params['leadId'];

    if (before.assignedToUserId !== after.assignedToUserId) {
      console.log(`Lead Assigned: ${leadId} assigned to ${after.assignedToUserId}`);
      // Notify new assignee
    }

    if (before.status !== 'qualified' && after.status === 'qualified') {
      console.log(`Lead Qualified: ${leadId}`);
      // Start qualification workflows
    }
};

export const onLeadUpdated = onDocumentUpdated(
  {
    document: 'leads/{leadId}',
    region: 'asia-south1'
  },
  handleLeadUpdated
);

