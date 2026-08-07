import { Event } from '../types/event';
import { EventStore } from '../store/EventStore';

export interface EventPublisher {
  /**
   * Publish an event.
   */
  publish(event: Event): Promise<void>;
}

export class DefaultEventPublisher implements EventPublisher {
  constructor(private eventStore: EventStore) {}

  async publish(event: Event): Promise<void> {
    // Save to EventStore first to ensure durability and immutability.
    // In an Event Sourced system, the EventStore is the source of truth.
    await this.eventStore.saveEvent(event);
    
    // In a Firestore-based setup, the actual dispatching can be handled 
    // by a Firestore Trigger (`onCreate` on the `events` collection) 
    // which then invokes the EventDispatcher.
  }
}
