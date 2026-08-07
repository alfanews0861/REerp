import { onDocumentUpdated } from 'firebase-functions/v2/firestore';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

export const onDealUpdated = onDocumentUpdated('deals/{dealId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;

  // Trigger commission logging when stage changes to 'Closed'
  if (before.stage !== 'Closed' && after.stage === 'Closed') {
    logger.info(`Deal ${event.params.dealId} closed. Logging agent revenue metrics.`);

    const db = admin.firestore();
    const analyticsRef = db.collection('analytics').doc('revenue_ytd');

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(analyticsRef);
      const currentTotal = doc.exists ? doc.data()?.totalRevenue || 0 : 0;
      const dealCommission = after.commission?.totalCommission || 0;

      transaction.set(
        analyticsRef,
        {
          totalRevenue: currentTotal + dealCommission,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
    });
  }
});
