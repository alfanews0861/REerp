import * as admin from 'firebase-admin';
import { Event } from '../types/event';

export interface DLQEvent {
  event: Event;
  failedAt: string;
  reason: string;
  retryCount: number;
}

export class DLQRepository {
  private db: admin.firestore.Firestore;
  private readonly collectionName = 'dead_letter_queue';

  constructor(db: admin.firestore.Firestore) {
    this.db = db;
  }

  async saveToDLQ(dlqEvent: DLQEvent): Promise<void> {
    const ref = this.db.collection(this.collectionName).doc(dlqEvent.event.eventId);
    await ref.set({
      ...dlqEvent,
      failedAt: new Date(dlqEvent.failedAt),
    });
  }

  async getDLQEvents(): Promise<DLQEvent[]> {
    const snapshot = await this.db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        failedAt: data.failedAt.toDate().toISOString(),
      } as DLQEvent;
    });
  }

  async removeFromDLQ(eventId: string): Promise<void> {
    await this.db.collection(this.collectionName).doc(eventId).delete();
  }
}
