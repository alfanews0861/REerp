import { describe, it, expect, vi, beforeEach, Mocked } from 'vitest';
import { OrganizationService } from '../services/OrganizationService';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { OrganizationSettingsRepository } from '../repositories/OrganizationSettingsRepository';

vi.mock('../repositories/CompanyRepository');
vi.mock('../repositories/OrganizationSettingsRepository');
vi.mock('../../authorization/permissionService', () => ({
  PermissionService: {
    can: vi.fn(() => true),
  }
}));

describe('Organization Services', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('OrganizationService', () => {
    it('should create a company and default settings', async () => {
      const mockCompanyRepo = new CompanyRepository() as Mocked<CompanyRepository>;
      const mockSettingsRepo = new OrganizationSettingsRepository() as Mocked<OrganizationSettingsRepository>;

      mockCompanyRepo.findByCode.mockResolvedValue(null);
      mockCompanyRepo.create.mockResolvedValue({ id: 'comp-1', name: 'Test', code: 'TEST' } as any);
      mockSettingsRepo.upsertForCompany.mockResolvedValue({ id: 'set-1', companyId: 'comp-1' } as any);

      const service = new OrganizationService(mockCompanyRepo, mockSettingsRepo);

      const result = await service.createCompany({
        name: 'Test',
        code: 'TEST',
        email: 'test@test.com',
        phone: '1234567890',
        address: '123',
        status: 'active',
        isActive: true
      }, 'user-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('comp-1');
      expect(mockCompanyRepo.create).toHaveBeenCalled();
      expect(mockSettingsRepo.upsertForCompany).toHaveBeenCalledWith('comp-1', {}, 'user-1');
    });

    it('should prevent creating a company with duplicate code', async () => {
      const mockCompanyRepo = new CompanyRepository() as Mocked<CompanyRepository>;
      const mockSettingsRepo = new OrganizationSettingsRepository() as Mocked<OrganizationSettingsRepository>;

      mockCompanyRepo.findByCode.mockResolvedValue({ id: 'comp-1', name: 'Test', code: 'TEST' } as any);

      const service = new OrganizationService(mockCompanyRepo, mockSettingsRepo);

      await expect(service.createCompany({
        name: 'Test 2',
        code: 'TEST',
        email: 'test@test.com',
        phone: '1234567890',
        address: '123',
        status: 'active',
        isActive: true
      }, 'user-1')).rejects.toThrow(/already exists/);
    });
  });
});
