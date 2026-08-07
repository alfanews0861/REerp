import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

export const onLeadCreated = onDocumentCreated('leads/{leadId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) return;

  const lead = snapshot.data();
  logger.info(`New lead created: ${lead.fullName} (${event.params.leadId})`);

  // Calculate automated lead score based on budget and source
  let score = 50;
  if (lead.budgetMax && lead.budgetMax > 1000000) {
    score += 30;
  }
  if (lead.source === 'Referral' || lead.source === 'Website') {
    score += 15;
  }

  await snapshot.ref.update({
    score,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});
