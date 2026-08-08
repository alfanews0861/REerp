import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InventoryBookingService } from '../realestate/services/InventoryBookingService';

vi.mock('../../config', () => ({
  getFirebaseInstance: () => ({
    db: {},
  }),
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  collection: vi.fn(),
  runTransaction: vi.fn(async (_, cb) => {
    const transaction = {
      get: vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({
          status: 'AVAILABLE',
          isAvailable: true,
          version: 1,
        }),
      }),
      set: vi.fn(),
      update: vi.fn(),
    };
    return cb(transaction);
  }),
}));

describe('InventoryBookingService', () => {
  let service: InventoryBookingService;

  beforeEach(() => {
    service = new InventoryBookingService();
    vi.clearAllMocks();
  });

  it('should successfully book a plot if it is AVAILABLE', async () => {
    const result = await service.bookPlot({
      plotId: 'plot1',
      customerId: 'cust1',
      customerName: 'John Doe',
      customerPhone: '1234567890',
      salesExecutiveId: 'exec1',
      salesExecutiveName: 'Jane Smith',
      branchId: 'branch1',
      projectId: 'proj1',
      projectName: 'Project 1',
      plotNumber: '1',
      plotSizeSqFt: 1200,
      agreedPricePerSqFt: 1000,
      totalPlotAmount: 1200000,
      discountAmount: 0,
      finalSaleAmount: 1200000,
    }, 'user1');

    expect(result).toBeDefined();
    expect(result.status).toBe('DRAFT');
    expect(result.plotId).toBe('plot1');
    expect(result.customerId).toBe('cust1');
  });
});
