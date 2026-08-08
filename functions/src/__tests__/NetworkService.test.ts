import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NetworkService } from '../services/network-service';

vi.mock('firebase-admin', () => {
  const firestore = {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    get: vi.fn(),
    set: vi.fn(),
  };
  return {
    firestore: vi.fn(() => firestore),
  };
});

import * as admin from 'firebase-admin';

describe('NetworkService', () => {
  let service: NetworkService;
  let db: any;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new NetworkService();
    db = admin.firestore();
  });

  it('should validate move correctly for valid move', async () => {
    // Mock getAncestors
    vi.spyOn(service, 'getAncestors').mockResolvedValue(['p1', 'p2']);
    
    const isValid = await service.validateMove('child1', 'newParent');
    expect(isValid).toBe(true);
  });

  it('should validate move as false for circular dependency', async () => {
    // new parent has the child in its ancestors
    vi.spyOn(service, 'getAncestors').mockResolvedValue(['p1', 'child1', 'p2']);
    
    const isValid = await service.validateMove('child1', 'newParent');
    expect(isValid).toBe(false);
  });

  it('should validate move as false for self parent', async () => {
    const isValid = await service.validateMove('child1', 'child1');
    expect(isValid).toBe(false);
  });
});
