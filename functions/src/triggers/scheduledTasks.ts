import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

// Daily maintenance & system audit log cleanup cron job
export const dailySystemCleanup = onSchedule('every 24 hours', async () => {
  const db = admin.firestore();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const snapshot = await db
    .collection('audit_logs')
    .where('timestamp', '<', thirtyDaysAgo)
    .limit(500)
    .get();

  if (snapshot.empty) return;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
});
