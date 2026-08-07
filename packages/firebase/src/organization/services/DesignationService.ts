import { UserProfile } from '@real-estate-erp/types';
import { DesignationRepository } from '../repositories/DesignationRepository';
import { DesignationModel } from '../../models/organization';
import { createDesignationSchema, updateDesignationSchema } from '../validators/designationSchema';
import { OrganizationCacheService } from './OrganizationCacheService';
import { PermissionService } from '../../authorization/permissionService';

export const STANDARD_DESIGNATIONS: { title: string; code: string; level: number; description: string }[] = [
  { title: 'Chief Executive Officer', code: 'CEO', level: 1, description: 'Chief Executive Officer' },
  { title: 'Managing Director', code: 'DIR', level: 1, description: 'Managing Director' },
  { title: 'General Manager', code: 'GM', level: 2, description: 'General Manager' },
  { title: 'Marketing Manager', code: 'MKT_MGR', level: 3, description: 'Head of Marketing' },
  { title: 'Sales Manager', code: 'SLS_MGR', level: 3, description: 'Head of Sales Operations' },
  { title: 'Marketing Executive', code: 'MKT_EXEC', level: 4, description: 'Marketing Specialist' },
  { title: 'Sales Executive', code: 'SLS_EXEC', level: 4, description: 'Sales Consultant & Executive' },
  { title: 'Telecaller', code: 'TELE', level: 5, description: 'Telecalling Representative' },
  { title: 'Accountant', code: 'ACCT', level: 4, description: 'Accounts & Finance Specialist' },
  { title: 'Driver', code: 'DRV', level: 5, description: 'Fleet Driver' },
];

export class DesignationService {
  private desigRepo: DesignationRepository;

  constructor(desigRepo: DesignationRepository = new DesignationRepository()) {
    this.desigRepo = desigRepo;
  }

  private validatePermission(user: UserProfile | null, permission: string): void {
    if (user && !PermissionService.can(user, permission)) {
      throw new Error(`Permission denied: User does not have permission '${permission}'`);
    }
  }

  public async getDesignation(designationId: string, currentUser: UserProfile | null = null): Promise<DesignationModel | null> {
    this.validatePermission(currentUser, 'designation:read');

    const cacheKey = `desig:${designationId}`;
    const cached = OrganizationCacheService.get<DesignationModel>(cacheKey);
    if (cached) return cached;

    const desig = await this.desigRepo.findById(designationId);
    if (desig) {
      OrganizationCacheService.set(cacheKey, desig);
    }
    return desig;
  }

  public async getDesignationsByCompany(
    companyId: string,
    includeInactive: boolean = false,
    currentUser: UserProfile | null = null
  ): Promise<DesignationModel[]> {
    this.validatePermission(currentUser, 'designation:read');
    return this.desigRepo.findByCompanyId(companyId, includeInactive);
  }

  public async createDesignation(
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DesignationModel> {
    this.validatePermission(currentUser, 'designation:create');

    const validated = createDesignationSchema.parse(input);
    const existing = await this.desigRepo.findByCode(validated.companyId, validated.code);
    if (existing) {
      throw new Error(`Designation with code '${validated.code}' already exists in this company.`);
    }

    const created = await this.desigRepo.create(validated as Omit<DesignationModel, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'isActive'>, userId);
    OrganizationCacheService.set(`desig:${created.id}`, created);
    return created;
  }

  public async createStandardDesignations(
    companyId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DesignationModel[]> {
    this.validatePermission(currentUser, 'designation:create');

    const createdList: DesignationModel[] = [];
    for (const std of STANDARD_DESIGNATIONS) {
      const existing = await this.desigRepo.findByCode(companyId, std.code);
      if (!existing) {
        const item = await this.createDesignation(
          {
            companyId,
            title: std.title,
            code: std.code,
            level: std.level,
            description: std.description,
            status: 'active',
          },
          userId,
          currentUser
        );
        createdList.push(item);
      }
    }
    return createdList;
  }

  public async updateDesignation(
    designationId: string,
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DesignationModel> {
    this.validatePermission(currentUser, 'designation:update');

    const validated = updateDesignationSchema.parse(input);
    const updated = await this.desigRepo.update(designationId, validated, userId);

    OrganizationCacheService.set(`desig:${designationId}`, updated);
    return updated;
  }

  public async softDeleteDesignation(
    designationId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<boolean> {
    this.validatePermission(currentUser, 'designation:delete');

    const success = await this.desigRepo.softDelete(designationId, userId);
    if (success) {
      OrganizationCacheService.invalidate(`desig:${designationId}`);
    }
    return success;
  }

  public async restoreDesignation(
    designationId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DesignationModel> {
    this.validatePermission(currentUser, 'designation:update');

    const restored = await this.desigRepo.restore(designationId, userId);
    OrganizationCacheService.set(`desig:${designationId}`, restored);
    return restored;
  }
}
