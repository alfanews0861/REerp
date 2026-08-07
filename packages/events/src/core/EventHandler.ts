import { Event } from '../types/event';

export interface EventHandler<T = any> {
  /**
   * The type of event this handler handles.
   * e.g., 'LeadCreated'
   */
  eventType: string;

  /**
   * Handle the event.
   */
  handle(event: Event<T>): Promise<void>;
}
