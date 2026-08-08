"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionHandler = void 0;
const commission_engine_1 = require("../../services/commission-engine");
class CommissionHandler {
    engine = new commission_engine_1.CommissionEngine();
    async handle(event) {
        if (event.eventType === 'BOOKING_FULLY_PAID') {
            const { bookingId } = event.payload;
            if (bookingId) {
                console.log(`CommissionHandler processing BOOKING_FULLY_PAID for booking ${bookingId}`);
                await this.engine.calculateCommission(bookingId);
            }
        }
    }
}
exports.CommissionHandler = CommissionHandler;
//# sourceMappingURL=CommissionHandler.js.map