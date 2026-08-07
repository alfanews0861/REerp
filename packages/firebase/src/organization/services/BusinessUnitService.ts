import { UserProfile } from '@real-estate-erp/types';
import { BusinessUnitRepository } from '../repositories/BusinessUnitRepository';
import { BusinessUnitModel } from '../../models/organization';
import { createBusinessUnitSchema, updateBusinessUnitSchema } from '../validators/businessUnitSchema';
import { OrganizationCacheService } from './OrganizationCacheService';
import { PermissionService } from '../../authorization/permissionService';

export class BusinessUnitService {
  private buRepo: BusinessUnitRepository;

  constructor(buRepo: BusinessUnitRepository = new BusinessUnitRepository()) {
    this.buRepo = buRepo;
  }

  private validatePermission(user: UserProfile | null, permission: string): void {
    if (user && !PermissionService.can(user, permission)) {
      throw new Error(`Permission denied: User does not have permission '${permission}'`);
    }
  }

  public async getBusinessUnit(buId: string, currentUser: UserProfile | null = null): Promise<BusinessUnitModel | null> {
    this.validatePermission(currentUser, 'business_unit:read');

    const cacheKey = `bu:${buId}`;
    const cached = OrganizationCacheService.get<BusinessUnitModel>(cacheKey);
    if (cached) return cached;

    const bu = await this.buRepo.findById(buId);
    if (bu) {
      OrganizationCacheService.set(cacheKey, bu);
    }
    return bu;
  }

  public async getBusinessUnitsByCompany(
    companyId: string,
    includeInactive: boolean = false,
    currentUser: UserProfile | null = null
  ): Promise<BusinessUnitModel[]> {
    this.validatePermission(currentUser, 'business_unit:read');
    return this.buRepo.findByCompanyId(companyId, includeInactive);
  }

  public async createBusinessUnit(
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BusinessUnitModel> {
    this.validatePermission(currentUser, 'business_unit:create');

    const validated = createBusinessUnitSchema.parse(input);
    const existing = await this.buRepo.findByCode(validated.companyId, validated.code);
    if (existing) {
      throw new Error(`Business unit with code '${validated.code}' already exists in this company.`);
    }

    const created = await this.buRepo.create(validated as Omit<BusinessUnitModel, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'isActive'>, userId);

    OrganizationCacheService.set(`bu:${created.id}`, created);
    return created;
  }

  public async updateBusinessUnit(
    buId: string,
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BusinessUnitModel> {
    this.validatePermission(currentUser, 'business_unit:update');

    const validated = updateBusinessUnitSchema.parse(input);
    const updated = await this.buRepo.update(buId, validated, userId);

    OrganizationCacheService.set(`bu:${buId}`, updated);
    return updated;
  }

  public async setBusinessUnitManager(
    buId: string,
    managerId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BusinessUnitModel> {
    this.validatePermission(currentUser, 'business_unit:update');
    return this.updateBusinessUnit(buId, { managerId }, userId, currentUser);
  }

  public async softDeleteBusinessUnit(
    buId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<boolean> {
    this.validatePermission(currentUser, 'business_unit:delete');

    const success = await this.buRepo.softDelete(buId, userId);
    if (success) {
      OrganizationCacheService.invalidate(`bu:${buId}`);
    }
    return success;
  }

  public async restoreBusinessUnit(
    buId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BusinessUnitModel> {
    this.validatePermission(currentUser, 'business_unit:update');

    const restored = await this.buRepo.restore(buId, userId);
    OrganizationCacheService.set(`bu:${buId}`, restored);
    return restored;
  }
}
