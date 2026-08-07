import { query, where, getDocs, orderBy, limit, DocumentData, Query } from 'firebase/firestore';
import { BaseRepository } from './BaseRepository';
import { InteractionModel, interactionConverter } from '../models/interaction';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';

export class InteractionRepository extends BaseRepository<InteractionModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.INTERACTIONS, 'Interaction', interactionConverter);
  }

  public async findByPersonId(personId: string, options?: { maxResults?: number }): Promise<InteractionModel[]> {
    let q: Query<InteractionModel, DocumentData> = query(
      this.collectionRef,
      where('personId', '==', personId),
      orderBy('date', 'desc')
    );
    
    if (options?.maxResults) {
      q = query(q, limit(options.maxResults));
    }
    
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  }

  public async getActivityFeed(limitCount: number = 50): Promise<InteractionModel[]> {
    const q = query(
      this.collectionRef,
      orderBy('date', 'desc'),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  }
}
