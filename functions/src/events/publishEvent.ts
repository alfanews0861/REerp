import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';
import { DefaultEventPublisher, Event, EventSchema } from '@real-estate-erp/events';
import { FirestoreEventStore } from '@real-estate-erp/events/src/store/FirestoreEventStore';

export const publishEvent = onCall(async (request) => {
  // Validate authentication
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'User must be authenticated to publish events.'
    );
  }

  const data = request.data;

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
    actor: request.auth.uid,
    payload: data.payload,
    metadata: {
      ...data.metadata,
      sourceIp: request.rawRequest.ip,
    },
  };

  // Validate the event structure
  try {
    EventSchema.parse(event);
  } catch (error) {
    throw new HttpsError(
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
    throw new HttpsError(
      'internal',
      'Failed to publish event.',
      error.message
    );
  }
});
