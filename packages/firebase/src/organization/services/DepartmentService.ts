import { UserProfile } from '@real-estate-erp/types';
import { DepartmentRepository } from '../repositories/DepartmentRepository';
import { DepartmentModel, DepartmentType } from '../../models/organization';
import { createDepartmentSchema, updateDepartmentSchema } from '../validators/departmentSchema';
import { OrganizationCacheService } from './OrganizationCacheService';
import { PermissionService } from '../../authorization/permissionService';

export const STANDARD_DEPARTMENTS: { name: string; code: string; type: DepartmentType; description: string }[] = [
  { name: 'Marketing', code: 'MKT', type: 'marketing', description: 'Marketing & Promotions' },
  { name: 'Sales', code: 'SLS', type: 'sales', description: 'Direct & Channel Sales' },
  { name: 'Accounts & Finance', code: 'ACC', type: 'accounts', description: 'Financial & Accounting Management' },
  { name: 'Legal & Compliance', code: 'LGL', type: 'legal', description: 'Legal Documentation & Compliance' },
  { name: 'Human Resources', code: 'HR', type: 'hr', description: 'HR & Personnel Operations' },
  { name: 'Administration', code: 'ADM', type: 'administration', description: 'Office Administration & Infrastructure' },
  { name: 'CRM & Customer Support', code: 'CRM', type: 'crm', description: 'Customer Relationship & Support Services' },
  { name: 'Operations & Fleet', code: 'OPS', type: 'operations', description: 'Site & Logistics Operations' },
];

export class DepartmentService {
  private deptRepo: DepartmentRepository;

  constructor(deptRepo: DepartmentRepository = new DepartmentRepository()) {
    this.deptRepo = deptRepo;
  }

  private validatePermission(user: UserProfile | null, permission: string): void {
    if (user && !PermissionService.can(user, permission)) {
      throw new Error(`Permission denied: User does not have permission '${permission}'`);
    }
  }

  public async getDepartment(departmentId: string, currentUser: UserProfile | null = null): Promise<DepartmentModel | null> {
    this.validatePermission(currentUser, 'department:read');

    const cacheKey = `dept:${departmentId}`;
    const cached = OrganizationCacheService.get<DepartmentModel>(cacheKey);
    if (cached) return cached;

    const dept = await this.deptRepo.findById(departmentId);
    if (dept) {
      OrganizationCacheService.set(cacheKey, dept);
    }
    return dept;
  }

  public async getDepartmentsByCompany(
    companyId: string,
    includeInactive: boolean = false,
    currentUser: UserProfile | null = null
  ): Promise<DepartmentModel[]> {
    this.validatePermission(currentUser, 'department:read');
    return this.deptRepo.findByCompanyId(companyId, includeInactive);
  }

  public async createDepartment(
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DepartmentModel> {
    this.validatePermission(currentUser, 'department:create');

    const validated = createDepartmentSchema.parse(input);
    const existing = await this.deptRepo.findByCode(validated.companyId, validated.code);
    if (existing) {
      throw new Error(`Department with code '${validated.code}' already exists in this company.`);
    }

    const created = await this.deptRepo.create(validated as Omit<DepartmentModel, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'isActive'>, userId);
    OrganizationCacheService.set(`dept:${created.id}`, created);
    return created;
  }

  public async createStandardDepartments(
    companyId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DepartmentModel[]> {
    this.validatePermission(currentUser, 'department:create');

    const createdDepts: DepartmentModel[] = [];
    for (const std of STANDARD_DEPARTMENTS) {
      const existing = await this.deptRepo.findByCode(companyId, std.code);
      if (!existing) {
        const dept = await this.createDepartment(
          {
            companyId,
            name: std.name,
            code: std.code,
            type: std.type,
            description: std.description,
            status: 'active',
          },
          userId,
          currentUser
        );
        createdDepts.push(dept);
      }
    }
    return createdDepts;
  }

  public async updateDepartment(
    departmentId: string,
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DepartmentModel> {
    this.validatePermission(currentUser, 'department:update');

    const validated = updateDepartmentSchema.parse(input);
    const updated = await this.deptRepo.update(departmentId, validated, userId);

    OrganizationCacheService.set(`dept:${departmentId}`, updated);
    return updated;
  }

  public async setDepartmentManager(
    departmentId: string,
    managerId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DepartmentModel> {
    this.validatePermission(currentUser, 'department:update');
    return this.updateDepartment(departmentId, { managerId }, userId, currentUser);
  }

  public async softDeleteDepartment(
    departmentId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<boolean> {
    this.validatePermission(currentUser, 'department:delete');

    const success = await this.deptRepo.softDelete(departmentId, userId);
    if (success) {
      OrganizationCacheService.invalidate(`dept:${departmentId}`);
    }
    return success;
  }

  public async restoreDepartment(
    departmentId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<DepartmentModel> {
    this.validatePermission(currentUser, 'department:update');

    const restored = await this.deptRepo.restore(departmentId, userId);
    OrganizationCacheService.set(`dept:${departmentId}`, restored);
    return restored;
  }
}
