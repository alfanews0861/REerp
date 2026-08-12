import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { EventDispatcher, Event } from '@real-estate-erp/events';

// Example Handlers - In a real app, you would import these from feature modules
// import { LeadCreatedHandler } from '../modules/leads/handlers';
// import { NotificationHandler } from '../modules/notifications/handlers';

import { CommissionHandler } from './handlers/CommissionHandler';
import { KPIAggregatorHandler } from './handlers/KPIAggregatorHandler';

const dispatcher = new EventDispatcher();
const kpiHandler = new KPIAggregatorHandler();

// Register existing handlers
dispatcher.subscribe('BOOKING_FULLY_PAID', new CommissionHandler());

// Register KPI aggregations
const kpiEvents = [
  'LEAD_CAPTURED', 'LEAD_QUALIFIED', 'SITE_VISIT_COMPLETED',
  'PLOT_BOOKED', 'BOOKING_CREATED', 'BOOKING_FULLY_PAID', 'PLOT_REGISTERED',
  'PAYMENT_RECEIVED', 'COMMISSION_APPROVED',
  'AFTER_SALES_CREATED', 'AFTER_SALES_RESOLVED'
];

kpiEvents.forEach(evt => dispatcher.subscribe(evt, kpiHandler as any));

export const handleEventCreated = async (cloudEvent: any) => {
    const eventData = cloudEvent.data?.data();
    if (!eventData) return;
    
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
};

export const onEventCreated = onDocumentCreated(
  {
    document: 'events/{eventId}',
    region: 'asia-south1'
  },
  handleEventCreated
);

