import { EventRepository } from '../repositories/EventRepository';
import { Event } from '../types/event';

export class EventReplayService {
  constructor(private eventRepository: EventRepository) {}

  /**
   * Rebuild state for an aggregate.
   */
  async rebuildState<T>(aggregateId: string, reducer: (state: T, event: Event) => T, initialState: T): Promise<T> {
    return this.eventRepository.replayEvents(aggregateId, reducer, initialState);
  }
}
