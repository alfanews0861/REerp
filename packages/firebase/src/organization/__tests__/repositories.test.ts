import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { BranchRepository } from '../repositories/BranchRepository';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(() => ({ id: 'mock-id' })),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
}));

describe('Organization Repositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CompanyRepository', () => {
    it('should be instantiable', () => {
      const repo = new CompanyRepository();
      expect(repo).toBeDefined();
    });
  });

  describe('BranchRepository', () => {
    it('should be instantiable', () => {
      const repo = new BranchRepository();
      expect(repo).toBeDefined();
    });
  });
});
