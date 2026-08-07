import { Event } from '../types/event';
import { DLQRepository, DLQEvent } from '../repositories/DLQRepository';
import { EventHandler } from '../core/EventHandler';

export class EventRetryService {
  private maxRetries = 3;

  constructor(private dlqRepository: DLQRepository) {}

  /**
   * Execute a handler with retries.
   * If it fails after maxRetries, move the event to the DLQ.
   */
  async executeWithRetry(handler: EventHandler, event: Event): Promise<void> {
    let attempt = 0;
    let lastError: any;

    while (attempt < this.maxRetries) {
      try {
        await handler.handle(event);
        return; // Success
      } catch (error) {
        attempt++;
        lastError = error;
        // Exponential backoff could be implemented here
        await new Promise(resolve => setTimeout(resolve, attempt * 1000));
      }
    }

    // Failed after retries, move to DLQ
    const dlqEvent: DLQEvent = {
      event,
      failedAt: new Date().toISOString(),
      reason: lastError?.message || String(lastError),
      retryCount: attempt,
    };

    await this.dlqRepository.saveToDLQ(dlqEvent);
  }
}
