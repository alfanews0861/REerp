import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp,
  SnapshotOptions,
  WithFieldValue,
} from 'firebase/firestore';
import { BaseFirestoreModel } from '../models/base';

function convertTimestampsToIso(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof Timestamp) {
      result[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      result[key] = convertTimestampsToIso(value as Record<string, unknown>);
    } else if (value instanceof Date) {
      result[key] = value.toISOString();
    } else {
      result[key] = value;
    }
  }
  return result;
}

export function createBaseConverter<T extends BaseFirestoreModel>(): FirestoreDataConverter<T> {
  return {
    toFirestore(model: WithFieldValue<T>): DocumentData {
      const modelObj = model as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...data } = modelObj;
      const firestoreData: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
          if (typeof value === 'string' && (key.endsWith('At') || key.endsWith('Date')) && !isNaN(Date.parse(value))) {
            firestoreData[key] = Timestamp.fromDate(new Date(value));
          } else {
            firestoreData[key] = value;
          }
        }
      }

      return firestoreData;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): T {
      const rawData = snapshot.data(options);
      const convertedData = convertTimestampsToIso(rawData);

      const now = new Date().toISOString();

      return {
        id: snapshot.id,
        createdAt: typeof convertedData.createdAt === 'string' ? convertedData.createdAt : now,
        updatedAt: typeof convertedData.updatedAt === 'string' ? convertedData.updatedAt : now,
        createdBy: typeof convertedData.createdBy === 'string' ? convertedData.createdBy : 'system',
        updatedBy: typeof convertedData.updatedBy === 'string' ? convertedData.updatedBy : 'system',
        isActive: typeof convertedData.isActive === 'boolean' ? convertedData.isActive : true,
        isDeleted: typeof convertedData.isDeleted === 'boolean' ? convertedData.isDeleted : false,
        version: typeof convertedData.version === 'number' ? convertedData.version : 1,
        ...convertedData,
      } as unknown as T;
    },
  };
}
