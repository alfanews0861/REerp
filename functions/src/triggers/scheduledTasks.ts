import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import { inventoryBookingService } from '@real-estate-erp/firebase';

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

// Hourly booking expiry job
export const hourlyBookingExpiry = onSchedule('every 1 hours', async () => {
  const db = admin.firestore();
  const now = new Date().toISOString();

  // Find all BOOKED plots whose expiry has passed
  const snapshot = await db
    .collection('plots')
    .where('status', '==', 'BOOKED')
    .where('bookingExpiryAt', '<', now)
    .get();

  if (snapshot.empty) return;

  for (const doc of snapshot.docs) {
    try {
      // Invoke existing service idempotently
      await inventoryBookingService.processBookingExpiry(doc.id, 'system-cron');
    } catch (error) {
      console.error(`Error processing expiry for plot ${doc.id}`, error);
    }
  }
});
