import { EventStore } from '../store/EventStore';
import { Event } from '../types/event';

export class EventRepository {
  constructor(private eventStore: EventStore) {}

  /**
   * Get the complete history of events for a specific aggregate.
   */
  async getEventHistory(aggregateId: string): Promise<Event[]> {
    return this.eventStore.getEventsForAggregate(aggregateId);
  }

  /**
   * Rebuild the current state of an aggregate by replaying its events.
   * This is a simplified example; typically, you'd pass a reducer function.
   */
  async replayEvents<T>(aggregateId: string, reducer: (state: T, event: Event) => T, initialState: T): Promise<T> {
    const events = await this.getEventHistory(aggregateId);
    return events.reduce(reducer, initialState);
  }
}
