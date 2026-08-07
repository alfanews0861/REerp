import { UserProfile } from '@real-estate-erp/types';
import { BranchRepository } from '../repositories/BranchRepository';
import { BranchModel, GeoLocation, CompanyAddress } from '../../models/organization';
import { createBranchSchema, updateBranchSchema } from '../validators/branchSchema';
import { OrganizationCacheService } from './OrganizationCacheService';
import { PermissionService } from '../../authorization/permissionService';

export class BranchService {
  private branchRepo: BranchRepository;

  constructor(branchRepo: BranchRepository = new BranchRepository()) {
    this.branchRepo = branchRepo;
  }

  private validatePermission(user: UserProfile | null, permission: string): void {
    if (user && !PermissionService.can(user, permission)) {
      throw new Error(`Permission denied: User does not have permission '${permission}'`);
    }
  }

  public async getBranch(branchId: string, currentUser: UserProfile | null = null): Promise<BranchModel | null> {
    this.validatePermission(currentUser, 'branch:read');

    const cacheKey = `branch:${branchId}`;
    const cached = OrganizationCacheService.get<BranchModel>(cacheKey);
    if (cached) return cached;

    const branch = await this.branchRepo.findById(branchId);
    if (branch) {
      OrganizationCacheService.set(cacheKey, branch);
    }
    return branch;
  }

  public async getBranchesByCompany(
    companyId: string,
    includeInactive: boolean = false,
    currentUser: UserProfile | null = null
  ): Promise<BranchModel[]> {
    this.validatePermission(currentUser, 'branch:read');
    return this.branchRepo.findByCompanyId(companyId, includeInactive);
  }

  public async createBranch(
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BranchModel> {
    this.validatePermission(currentUser, 'branch:create');

    const validated = createBranchSchema.parse(input);
    const existing = await this.branchRepo.findByCode(validated.companyId, validated.code);
    if (existing) {
      throw new Error(`Branch with code '${validated.code}' already exists in this company.`);
    }

    const created = await this.branchRepo.create(validated as Omit<BranchModel, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'isActive'>, userId);
    OrganizationCacheService.set(`branch:${created.id}`, created);
    return created;
  }

  public async updateBranch(
    branchId: string,
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BranchModel> {
    this.validatePermission(currentUser, 'branch:update');

    const validated = updateBranchSchema.parse(input);
    const updated = await this.branchRepo.update(branchId, validated, userId);

    OrganizationCacheService.set(`branch:${branchId}`, updated);
    return updated;
  }

  public async setBranchManager(
    branchId: string,
    managerId: string,
    managerName: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BranchModel> {
    this.validatePermission(currentUser, 'branch:update');
    return this.updateBranch(branchId, { managerId, managerName }, userId, currentUser);
  }

  public async updateBranchStatus(
    branchId: string,
    status: 'active' | 'inactive' | 'closed' | 'maintenance',
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BranchModel> {
    this.validatePermission(currentUser, 'branch:update');
    return this.updateBranch(branchId, { status }, userId, currentUser);
  }

  public async updateBranchAddress(
    branchId: string,
    address: string,
    structuredAddress?: CompanyAddress,
    userId: string = 'system',
    currentUser: UserProfile | null = null
  ): Promise<BranchModel> {
    this.validatePermission(currentUser, 'branch:update');
    return this.updateBranch(branchId, { address, structuredAddress }, userId, currentUser);
  }

  public async updateBranchGps(
    branchId: string,
    gpsCoordinates: GeoLocation,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BranchModel> {
    this.validatePermission(currentUser, 'branch:update');
    return this.updateBranch(branchId, { gpsCoordinates }, userId, currentUser);
  }

  public async softDeleteBranch(
    branchId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<boolean> {
    this.validatePermission(currentUser, 'branch:delete');

    const success = await this.branchRepo.softDelete(branchId, userId);
    if (success) {
      OrganizationCacheService.invalidate(`branch:${branchId}`);
    }
    return success;
  }

  public async restoreBranch(
    branchId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<BranchModel> {
    this.validatePermission(currentUser, 'branch:update');

    const restored = await this.branchRepo.restore(branchId, userId);
    OrganizationCacheService.set(`branch:${branchId}`, restored);
    return restored;
  }
}
