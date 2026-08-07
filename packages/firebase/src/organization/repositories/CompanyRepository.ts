import { where } from 'firebase/firestore';
import { BaseRepository } from '../../repositories/BaseRepository';
import { CompanyModel } from '../../models/organization';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { companyConverter } from '../../converters/typedConverters';

export class CompanyRepository extends BaseRepository<CompanyModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMPANIES, 'Company', companyConverter);
  }

  public async findByCode(code: string): Promise<CompanyModel | null> {
    const results = await this.findAll([where('code', '==', code.toUpperCase())]);
    return results.length > 0 ? results[0] : null;
  }

  public async findActiveCompanies(): Promise<CompanyModel[]> {
    return this.findAll([where('status', '==', 'active')]);
  }
}
