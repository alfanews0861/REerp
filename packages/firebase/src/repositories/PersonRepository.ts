import { query, where, getDocs } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { PersonModel, personConverter } from '../models/person';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';

export class PersonRepository extends BaseRepository<PersonModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.PERSONS, 'Person', personConverter);
  }

  public async findByMobile(mobileNumber: string): Promise<PersonModel[]> {
    const q = query(
      this.collectionRef,
      where('mobileNumbers', 'array-contains', mobileNumber),
      where('isDeleted', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  }

  public async findByEmail(email: string): Promise<PersonModel[]> {
    const q = query(
      this.collectionRef,
      where('emailAddresses', 'array-contains', email),
      where('isDeleted', '==', false)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  }
}
