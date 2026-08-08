import * as functions from 'firebase-functions';
import { EventDispatcher, Event } from '@real-estate-erp/events';

// Example Handlers - In a real app, you would import these from feature modules
// import { LeadCreatedHandler } from '../modules/leads/handlers';
// import { NotificationHandler } from '../modules/notifications/handlers';

import { CommissionHandler } from './handlers/CommissionHandler';

const dispatcher = new EventDispatcher();

// Register handlers
dispatcher.subscribe('BOOKING_FULLY_PAID', new CommissionHandler());

export const onEventCreated = functions.firestore
  .document('events/{eventId}')
  .onCreate(async (snapshot, _context) => {
    const eventData = snapshot.data();
    
    // Convert Firestore Timestamp back to ISO string if necessary,
    // though the Event object should already be well-formed from publisher.
    const event: Event = {
      ...eventData,
      timestamp: eventData.timestamp.toDate().toISOString(),
    } as Event;

    try {
      console.log(`Dispatching event: ${event.eventType} for aggregate: ${event.aggregateId}`);
      await dispatcher.dispatch(event);
    } catch (error) {
      console.error(`Failed to process event ${event.eventId}:`, error);
      // In a production system, you'd integrate the EventRetryService and DLQRepository here.
      // E.g., await retryService.executeWithRetry(dispatcher, event);
      // Or throw so Firebase can retry if retry is enabled on the function.
      throw error;
    }
  });
