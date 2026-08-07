import { Event } from '../types/event';

export interface EventStore {
  /**
   * Save an event immutably to the event store.
   * Business Rule: Events are immutable. Events cannot be edited.
   */
  saveEvent(event: Event): Promise<void>;
  
  /**
   * Retrieve all events for a specific aggregate, ordered by version.
   */
  getEventsForAggregate(aggregateId: string): Promise<Event[]>;
  
  /**
   * Get the latest version number for an aggregate.
   */
  getLatestVersion(aggregateId: string): Promise<number>;
}
