import { where } from 'firebase/firestore';
import { BaseRepository } from '../../repositories/BaseRepository';
import { BranchModel } from '../../models/organization';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { branchConverter } from '../../converters/typedConverters';

export class BranchRepository extends BaseRepository<BranchModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.BRANCHES, 'Branch', branchConverter);
  }

  public async findByCompanyId(companyId: string, includeInactive: boolean = false): Promise<BranchModel[]> {
    const constraints = [where('companyId', '==', companyId)];
    if (!includeInactive) {
      constraints.push(where('status', '==', 'active'));
    }
    return this.findAll(constraints);
  }

  public async findByCode(companyId: string, code: string): Promise<BranchModel | null> {
    const results = await this.findAll([
      where('companyId', '==', companyId),
      where('code', '==', code.toUpperCase()),
    ]);
    return results.length > 0 ? results[0] : null;
  }

  public async findMainBranch(companyId: string): Promise<BranchModel | null> {
    const results = await this.findAll([
      where('companyId', '==', companyId),
      where('isMainBranch', '==', true),
    ]);
    return results.length > 0 ? results[0] : null;
  }

  public async findByManagerId(managerId: string): Promise<BranchModel[]> {
    return this.findAll([where('managerId', '==', managerId)]);
  }
}
