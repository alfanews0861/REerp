import { query, where, getDocs, limit } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { LeadModel } from '../models/leads';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';
import { leadConverter } from '../converters/typedConverters';

export class LeadRepository extends BaseRepository<LeadModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.LEADS, 'Lead', leadConverter);
  }

  public async findByPhone(phone: string): Promise<LeadModel[]> {
    const q = query(
      this.collectionRef,
      where('phone', '==', phone),
      where('isDeleted', '==', false),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  }

  public async findByEmail(email: string): Promise<LeadModel[]> {
    const q = query(
      this.collectionRef,
      where('email', '==', email),
      where('isDeleted', '==', false),
      limit(10)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  }

  public async findByCompanyId(companyId: string): Promise<LeadModel[]> {
    const q = query(
      this.collectionRef,
      where('companyId', '==', companyId),
      where('isDeleted', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  }
}
