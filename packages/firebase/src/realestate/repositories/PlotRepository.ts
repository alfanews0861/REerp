import { BaseRepository } from '../../repositories/BaseRepository';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { PlotModel } from '../../models';
import { plotConverter } from '../../converters/typedConverters';
import { BatchService, BatchOperation } from '../../services/batchService';
import { doc } from 'firebase/firestore';

export class PlotRepository extends BaseRepository<PlotModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.PLOTS, 'Plot', plotConverter);
  }

  public async bulkImport(plots: Omit<PlotModel, 'id' | 'createdAt' | 'updatedAt' | 'version'>[], userId: string): Promise<void> {
    const now = new Date().toISOString();
    const operations: BatchOperation<PlotModel>[] = plots.map(plot => {
      const docRef = doc(this.collectionRef);
      return {
        type: 'set',
        ref: docRef,
        data: {
          ...plot,
          id: docRef.id,
          createdAt: now,
          updatedAt: now,
          createdBy: userId,
          updatedBy: userId,
          isActive: true,
          isDeleted: false,
          version: 1,
        } as PlotModel
      };
    });

    await BatchService.executeBatch(operations);
  }

  public async bulkUpdate(updates: { id: string; data: Partial<PlotModel> }[], userId: string): Promise<void> {
    const now = new Date().toISOString();
    const operations: BatchOperation<PlotModel>[] = updates.map(update => {
      const docRef = this.getDocRef(update.id);
      return {
        type: 'update',
        ref: docRef,
        data: {
          ...update.data,
          updatedAt: now,
          updatedBy: userId,
        }
      };
    });

    await BatchService.executeBatch(operations);
  }
}
