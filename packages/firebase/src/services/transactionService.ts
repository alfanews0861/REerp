import {
  runTransaction,
  Transaction,
} from 'firebase/firestore';
import { getFirebaseInstance } from '../config';

export class TransactionService {
  public static async run<T>(
    updateFunction: (transaction: Transaction) => Promise<T>
  ): Promise<T> {
    const { db } = getFirebaseInstance();
    return runTransaction(db, async (transaction) => {
      return await updateFunction(transaction);
    });
  }
}
