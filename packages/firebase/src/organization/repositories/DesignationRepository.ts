import { where } from 'firebase/firestore';
import { BaseRepository } from '../../repositories/BaseRepository';
import { DesignationModel } from '../../models/organization';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { designationConverter } from '../../converters/typedConverters';

export class DesignationRepository extends BaseRepository<DesignationModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.DESIGNATIONS, 'Designation', designationConverter);
  }

  public async findByCompanyId(companyId: string, includeInactive: boolean = false): Promise<DesignationModel[]> {
    const constraints = [where('companyId', '==', companyId)];
    if (!includeInactive) {
      constraints.push(where('status', '==', 'active'));
    }
    return this.findAll(constraints);
  }

  public async findByDepartmentId(departmentId: string): Promise<DesignationModel[]> {
    return this.findAll([where('departmentId', '==', departmentId)]);
  }

  public async findByCode(companyId: string, code: string): Promise<DesignationModel | null> {
    const results = await this.findAll([
      where('companyId', '==', companyId),
      where('code', '==', code.toUpperCase()),
    ]);
    return results.length > 0 ? results[0] : null;
  }

  public async findByLevel(companyId: string, level: number): Promise<DesignationModel[]> {
    return this.findAll([
      where('companyId', '==', companyId),
      where('level', '==', level),
    ]);
  }
}
