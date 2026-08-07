import { UserProfile } from '@real-estate-erp/types';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { OrganizationSettingsRepository } from '../repositories/OrganizationSettingsRepository';
import { CompanyModel, OrganizationSettingsModel } from '../../models/organization';
import { createCompanySchema, updateCompanySchema } from '../validators/companySchema';
import { createOrganizationSettingsSchema } from '../validators/organizationSettingsSchema';
import { OrganizationCacheService } from './OrganizationCacheService';
import { PermissionService } from '../../authorization/permissionService';

export class OrganizationService {
  private companyRepo: CompanyRepository;
  private settingsRepo: OrganizationSettingsRepository;

  constructor(
    companyRepo: CompanyRepository = new CompanyRepository(),
    settingsRepo: OrganizationSettingsRepository = new OrganizationSettingsRepository()
  ) {
    this.companyRepo = companyRepo;
    this.settingsRepo = settingsRepo;
  }

  private validatePermission(user: UserProfile | null, permission: string): void {
    if (user && !PermissionService.can(user, permission)) {
      throw new Error(`Permission denied: User does not have permission '${permission}'`);
    }
  }

  public async getCompany(companyId: string, currentUser: UserProfile | null = null): Promise<CompanyModel | null> {
    this.validatePermission(currentUser, 'company:read');

    const cacheKey = `company:${companyId}`;
    const cached = OrganizationCacheService.get<CompanyModel>(cacheKey);
    if (cached) return cached;

    const company = await this.companyRepo.findById(companyId);
    if (company) {
      OrganizationCacheService.set(cacheKey, company);
    }
    return company;
  }

  public async getCompanyByCode(code: string, currentUser: UserProfile | null = null): Promise<CompanyModel | null> {
    this.validatePermission(currentUser, 'company:read');
    return this.companyRepo.findByCode(code);
  }

  public async createCompany(
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<CompanyModel> {
    this.validatePermission(currentUser, 'company:create');

    const validated = createCompanySchema.parse(input);
    const existing = await this.companyRepo.findByCode(validated.code);
    if (existing) {
      throw new Error(`Company with code '${validated.code}' already exists.`);
    }

    const created = await this.companyRepo.create(validated as Omit<CompanyModel, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'isActive'>, userId);

    // Initialize default organization settings for the company
    await this.settingsRepo.upsertForCompany(created.id, {}, userId);

    OrganizationCacheService.set(`company:${created.id}`, created);
    return created;
  }

  public async updateCompany(
    companyId: string,
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<CompanyModel> {
    this.validatePermission(currentUser, 'company:update');

    const validated = updateCompanySchema.parse(input);
    const updated = await this.companyRepo.update(companyId, validated, userId);

    OrganizationCacheService.invalidate(`company:${companyId}`);
    OrganizationCacheService.set(`company:${companyId}`, updated);
    return updated;
  }

  public async softDeleteCompany(
    companyId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<boolean> {
    this.validatePermission(currentUser, 'company:delete');

    const success = await this.companyRepo.softDelete(companyId, userId);
    if (success) {
      OrganizationCacheService.invalidate(`company:${companyId}`);
    }
    return success;
  }

  public async restoreCompany(
    companyId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<CompanyModel> {
    this.validatePermission(currentUser, 'company:update');

    const restored = await this.companyRepo.restore(companyId, userId);
    OrganizationCacheService.set(`company:${companyId}`, restored);
    return restored;
  }

  public async getSettings(
    companyId: string,
    currentUser: UserProfile | null = null
  ): Promise<OrganizationSettingsModel | null> {
    this.validatePermission(currentUser, 'settings:read');

    const cacheKey = `org_settings:${companyId}`;
    const cached = OrganizationCacheService.get<OrganizationSettingsModel>(cacheKey);
    if (cached) return cached;

    const settings = await this.settingsRepo.findByCompanyId(companyId);
    if (settings) {
      OrganizationCacheService.set(cacheKey, settings);
    }
    return settings;
  }

  public async updateSettings(
    companyId: string,
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<OrganizationSettingsModel> {
    this.validatePermission(currentUser, 'settings:update');

    const validated = createOrganizationSettingsSchema.partial().parse(input);
    const updated = await this.settingsRepo.upsertForCompany(companyId, validated, userId);

    OrganizationCacheService.set(`org_settings:${companyId}`, updated);
    return updated;
  }
}
