import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { FirestoreEventStore, DefaultEventPublisher, Event, EventSchema } from '@real-estate-erp/events';

export const publishEvent = functions.https.onCall(async (data, context) => {
  // Validate authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to publish events.'
    );
  }

  const db = admin.firestore();
  const eventStore = new FirestoreEventStore(db);
  const eventPublisher = new DefaultEventPublisher(eventStore);

  // Construct the full Event object
  const event: Event = {
    eventId: crypto.randomUUID(),
    aggregateId: data.aggregateId,
    aggregateType: data.aggregateType,
    eventType: data.eventType,
    timestamp: new Date().toISOString(),
    version: data.version || 1, // Optional logic to determine next version
    actor: context.auth.uid,
    payload: data.payload,
    metadata: {
      ...data.metadata,
      sourceIp: context.rawRequest.ip,
    },
  };

  // Validate the event structure
  try {
    EventSchema.parse(event);
  } catch (error) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Event payload does not match schema.',
      error
    );
  }

  try {
    await eventPublisher.publish(event);
    return { success: true, eventId: event.eventId };
  } catch (error: any) {
    console.error('Error publishing event:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to publish event.',
      error.message
    );
  }
});
