"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const network_service_1 = require("../services/network-service");
vitest_1.vi.mock('firebase-admin', () => {
    const firestore = {
        collection: vitest_1.vi.fn().mockReturnThis(),
        doc: vitest_1.vi.fn().mockReturnThis(),
        get: vitest_1.vi.fn(),
        set: vitest_1.vi.fn(),
    };
    return {
        firestore: vitest_1.vi.fn(() => firestore),
    };
});
(0, vitest_1.describe)('NetworkService', () => {
    let service;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        service = new network_service_1.NetworkService();
    });
    (0, vitest_1.it)('should validate move correctly for valid move', async () => {
        // Mock getAncestors
        vitest_1.vi.spyOn(service, 'getAncestors').mockResolvedValue(['p1', 'p2']);
        const isValid = await service.validateMove('child1', 'newParent');
        (0, vitest_1.expect)(isValid).toBe(true);
    });
    (0, vitest_1.it)('should validate move as false for circular dependency', async () => {
        // new parent has the child in its ancestors
        vitest_1.vi.spyOn(service, 'getAncestors').mockResolvedValue(['p1', 'child1', 'p2']);
        const isValid = await service.validateMove('child1', 'newParent');
        (0, vitest_1.expect)(isValid).toBe(false);
    });
    (0, vitest_1.it)('should validate move as false for self parent', async () => {
        const isValid = await service.validateMove('child1', 'child1');
        (0, vitest_1.expect)(isValid).toBe(false);
    });
});
//# sourceMappingURL=NetworkService.test.js.map