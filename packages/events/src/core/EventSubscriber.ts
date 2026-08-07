import { EventHandler } from './EventHandler';

export interface EventSubscriber {
  /**
   * Subscribe a handler to a specific event type.
   */
  subscribe(eventType: string, handler: EventHandler): void;
  
  /**
   * Unsubscribe a handler from a specific event type.
   */
  unsubscribe(eventType: string, handler: EventHandler): void;
}
