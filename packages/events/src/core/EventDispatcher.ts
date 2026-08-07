import { EventSubscriber } from './EventSubscriber';
import { EventHandler } from './EventHandler';
import { Event } from '../types/event';

export class EventDispatcher implements EventSubscriber {
  private handlers: Map<string, EventHandler[]> = new Map();

  subscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  unsubscribe(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) return;
    
    const currentHandlers = this.handlers.get(eventType)!;
    this.handlers.set(
      eventType,
      currentHandlers.filter(h => h !== handler)
    );
  }

  /**
   * Dispatch an event to all registered handlers for its type.
   * In an enterprise setup, this might be called by the Cloud Function subscriber
   * when an event is pulled from Pub/Sub or Firestore triggers.
   */
  async dispatch(event: Event): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventType) || [];
    
    // Execute all handlers concurrently
    // If one fails, it could be handled by a RetryService or DLQ higher up.
    await Promise.all(
      eventHandlers.map(handler => handler.handle(event))
    );
  }
}
