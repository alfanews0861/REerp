import {
  writeBatch,
  DocumentReference,
  SetOptions,
} from 'firebase/firestore';
import { getFirebaseInstance } from '../config';

export interface BatchOperation<T> {
  type: 'set' | 'update' | 'delete';
  ref: DocumentReference<T>;
  data?: Partial<T>;
  options?: SetOptions;
}

export class BatchService {
  private static MAX_BATCH_SIZE = 500;

  public static async executeBatch<T>(operations: BatchOperation<T>[]): Promise<void> {
    const { db } = getFirebaseInstance();
    const chunks: BatchOperation<T>[][] = [];

    for (let i = 0; i < operations.length; i += BatchService.MAX_BATCH_SIZE) {
      chunks.push(operations.slice(i, i + BatchService.MAX_BATCH_SIZE));
    }

    for (const chunk of chunks) {
      const batch = writeBatch(db);
      for (const op of chunk) {
        if (op.type === 'set' && op.data) {
          if (op.options) {
            batch.set(op.ref, op.data, op.options);
          } else {
            batch.set(op.ref, op.data as T);
          }
        } else if (op.type === 'update' && op.data) {
          batch.update(op.ref, op.data as Record<string, unknown>);
        } else if (op.type === 'delete') {
          batch.delete(op.ref);
        }
      }
      await batch.commit();
    }
  }
}
