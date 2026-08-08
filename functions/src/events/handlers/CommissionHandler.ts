import { EventHandler, Event } from '@real-estate-erp/events';
import { CommissionEngine } from '../../services/commission-engine';

export class CommissionHandler implements EventHandler {
  public eventType = 'BOOKING_FULLY_PAID';
  private engine = new CommissionEngine();

  async handle(event: Event): Promise<void> {
    if (event.eventType === 'BOOKING_FULLY_PAID') {
      const { bookingId } = event.payload;
      if (bookingId) {
        console.log(`CommissionHandler processing BOOKING_FULLY_PAID for booking ${bookingId}`);
        await this.engine.calculateCommission(bookingId);
      }
    }
  }
}
