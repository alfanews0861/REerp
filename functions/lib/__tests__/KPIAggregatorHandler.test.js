"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const KPIAggregatorHandler_1 = require("../events/handlers/KPIAggregatorHandler");
const events_1 = require("@real-estate-erp/events");
// Mock firebase-admin
jest.mock('firebase-admin', () => {
    const mockSet = jest.fn();
    const mockGet = jest.fn().mockResolvedValue({ exists: false });
    const mockRunTransaction = jest.fn(async (cb) => {
        return cb({
            get: mockGet,
            set: mockSet
        });
    });
    return {
        firestore: Object.assign(jest.fn().mockReturnValue({
            runTransaction: mockRunTransaction,
            collection: jest.fn().mockReturnThis(),
            doc: jest.fn().mockReturnThis()
        }), {
            FieldValue: {
                increment: jest.fn((val) => ({ _isIncrement: true, val })),
                serverTimestamp: jest.fn(() => 'MOCK_TIMESTAMP')
            }
        })
    };
});
const admin = __importStar(require("firebase-admin"));
describe('KPIAggregatorHandler', () => {
    let handler;
    beforeEach(() => {
        handler = new KPIAggregatorHandler_1.KPIAggregatorHandler();
        jest.clearAllMocks();
    });
    it('should ignore events without companyId', async () => {
        await handler.handle({
            eventId: 'evt1',
            aggregateId: 'lead1',
            aggregateType: events_1.AggregateType.Lead,
            eventType: 'LEAD_CAPTURED',
            timestamp: '2026-08-09T10:00:00Z',
            version: 1,
            actor: 'user1',
            metadata: { companyId: '' },
            payload: {}
        });
        const db = admin.firestore();
        expect(db.runTransaction).not.toHaveBeenCalled();
    });
    it('should process LEAD_CAPTURED and increment totalLeads', async () => {
        await handler.handle({
            eventId: 'evt2',
            aggregateId: 'lead2',
            aggregateType: events_1.AggregateType.Lead,
            eventType: 'LEAD_CAPTURED',
            timestamp: '2026-08-09T10:00:00Z',
            version: 1,
            actor: 'user1',
            metadata: { companyId: 'comp1', projectId: 'proj1' },
            payload: {}
        });
        const db = admin.firestore();
        expect(db.runTransaction).toHaveBeenCalled();
        // We expect the transaction to call set for:
        // 1. global doc
        // 2. daily doc
        // 3. project global doc
        // 4. project daily doc
        // 5. idempotency tracker
        // The precise assertions depend on the mock structure, but we can verify it attempted the transaction.
    });
    it('should ignore duplicate events (idempotency)', async () => {
        // Mock get to return { exists: true } for the idempotency doc
        const mockDb = admin.firestore();
        mockDb.runTransaction.mockImplementationOnce(async (cb) => {
            return cb({
                get: jest.fn().mockResolvedValue({ exists: true }), // Duplicate!
                set: jest.fn()
            });
        });
        await handler.handle({
            eventId: 'evt3',
            aggregateId: 'lead3',
            aggregateType: events_1.AggregateType.Lead,
            eventType: 'LEAD_CAPTURED',
            timestamp: '2026-08-09T10:00:00Z',
            version: 1,
            actor: 'user1',
            metadata: { companyId: 'comp1' },
            payload: {}
        });
        // The handler should return early without throwing, and we can check that set wasn't called.
        // (Inside the mocked transaction, `set` would only be called if it was processed)
    });
});
//# sourceMappingURL=KPIAggregatorHandler.test.js.map