import { where } from 'firebase/firestore';
import { BaseRepository } from '../../repositories/BaseRepository';
import { DepartmentModel, DepartmentType } from '../../models/organization';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { departmentConverter } from '../../converters/typedConverters';

export class DepartmentRepository extends BaseRepository<DepartmentModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.DEPARTMENTS, 'Department', departmentConverter);
  }

  public async findByCompanyId(companyId: string, includeInactive: boolean = false): Promise<DepartmentModel[]> {
    const constraints = [where('companyId', '==', companyId)];
    if (!includeInactive) {
      constraints.push(where('status', '==', 'active'));
    }
    return this.findAll(constraints);
  }

  public async findByBranchId(branchId: string): Promise<DepartmentModel[]> {
    return this.findAll([where('branchId', '==', branchId)]);
  }

  public async findByCode(companyId: string, code: string): Promise<DepartmentModel | null> {
    const results = await this.findAll([
      where('companyId', '==', companyId),
      where('code', '==', code.toUpperCase()),
    ]);
    return results.length > 0 ? results[0] : null;
  }

  public async findByType(companyId: string, type: DepartmentType): Promise<DepartmentModel[]> {
    return this.findAll([
      where('companyId', '==', companyId),
      where('type', '==', type),
    ]);
  }
}
