import { where } from 'firebase/firestore';
import { BaseRepository } from '../../repositories/BaseRepository';
import { BusinessUnitModel } from '../../models/organization';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { businessUnitConverter } from '../../converters/typedConverters';

export class BusinessUnitRepository extends BaseRepository<BusinessUnitModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.BUSINESS_UNITS, 'BusinessUnit', businessUnitConverter);
  }

  public async findByCompanyId(companyId: string, includeInactive: boolean = false): Promise<BusinessUnitModel[]> {
    const constraints = [where('companyId', '==', companyId)];
    if (!includeInactive) {
      constraints.push(where('status', '==', 'active'));
    }
    return this.findAll(constraints);
  }

  public async findByCode(companyId: string, code: string): Promise<BusinessUnitModel | null> {
    const results = await this.findAll([
      where('companyId', '==', companyId),
      where('code', '==', code.toUpperCase()),
    ]);
    return results.length > 0 ? results[0] : null;
  }

  public async findByManagerId(managerId: string): Promise<BusinessUnitModel[]> {
    return this.findAll([where('managerId', '==', managerId)]);
  }
}
