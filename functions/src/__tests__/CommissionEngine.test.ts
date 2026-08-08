import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CommissionEngine } from '../services/commission-engine';
import { CommissionRule, NetworkMember, PlotBooking } from '@real-estate-erp/types';

const mockBatch = {
  set: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  commit: vi.fn().mockResolvedValue(true),
};

vi.mock('firebase-admin', () => {
  const firestore = {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    get: vi.fn(),
    where: vi.fn().mockReturnThis(),
    batch: vi.fn(() => mockBatch),
  };
  return {
    firestore: vi.fn(() => firestore),
  };
});

import * as admin from 'firebase-admin';

describe('CommissionEngine', () => {
  let engine: CommissionEngine;
  let db: any;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new CommissionEngine();
    db = admin.firestore();
  });

  it('should calculate commission correctly for single eligible member', async () => {
    const booking: Partial<PlotBooking> = {
      id: 'book-1',
      projectId: 'proj-1',
      plotId: 'plot-1',
      finalSaleAmount: 1000000,
      salesExecutiveId: 'exec-1',
    };

    const member: Partial<NetworkMember> = {
      id: 'exec-1',
      positionId: 'pos-exec',
      ancestors: [],
    };

    const rule: Partial<CommissionRule> = {
      id: 'rule-1',
      positionId: 'pos-exec',
      commissionType: 'PERCENTAGE',
      percentage: 2,
      priority: 1,
    };

    // Setup mocks
    const getMock = vi.fn();
    
    // First call is for booking
    getMock.mockResolvedValueOnce({
      exists: true,
      data: () => booking
    });
    
    // Second call is for member
    getMock.mockResolvedValueOnce({
      exists: true,
      data: () => member
    });

    // Rules query
    db.where().where().get = vi.fn().mockResolvedValue({
      docs: [{ data: () => rule }]
    });

    // Member doc for loop
    getMock.mockResolvedValueOnce({
      exists: true,
      data: () => member
    });

    db.get = getMock;
    db.doc = vi.fn().mockReturnValue({ get: getMock, id: 'new-id' });
    
    await engine.calculateCommission('book-1');

    // 2% of 1,000,000 = 20,000
    // Batch should have been called twice (1 for record, 1 for pool)
    expect(mockBatch.set).toHaveBeenCalledTimes(2);
    
    // First set is the record
    const recordArg = mockBatch.set.mock.calls[0][1];
    expect(recordArg.amount).toBe(20000);
    
    // Second set is the pool
    const poolArg = mockBatch.set.mock.calls[1][1];
    expect(poolArg.totalCommissionCalculated).toBe(20000);
  });
});
