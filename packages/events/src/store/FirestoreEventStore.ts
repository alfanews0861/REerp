import * as admin from 'firebase-admin';
import { EventStore } from './EventStore';
import { Event } from '../types/event';

export class FirestoreEventStore implements EventStore {
  private db: admin.firestore.Firestore;
  private readonly collectionName = 'events';

  constructor(db: admin.firestore.Firestore) {
    this.db = db;
  }

  async saveEvent(event: Event): Promise<void> {
    const eventRef = this.db.collection(this.collectionName).doc(event.eventId);
    
    // Check if event already exists to prevent modification/duplicate
    const doc = await eventRef.get();
    if (doc.exists) {
      throw new Error(`Event with ID ${event.eventId} already exists. Events are immutable.`);
    }

    await eventRef.set({
      ...event,
      // Store timestamp as a Date object for better querying in Firestore
      timestamp: new Date(event.timestamp),
    });
  }

  async getEventsForAggregate(aggregateId: string): Promise<Event[]> {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('aggregateId', '==', aggregateId)
      .orderBy('version', 'asc')
      .get();

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        timestamp: data.timestamp.toDate().toISOString(),
      } as Event;
    });
  }

  async getLatestVersion(aggregateId: string): Promise<number> {
    const snapshot = await this.db
      .collection(this.collectionName)
      .where('aggregateId', '==', aggregateId)
      .orderBy('version', 'desc')
      .limit(1)
      .get();

    if (snapshot.empty) {
      return 0;
    }

    return snapshot.docs[0].data().version;
  }
}
