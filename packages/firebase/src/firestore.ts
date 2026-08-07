import {
  collection,
  doc,
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { getFirebaseInstance } from './config';

export function createTypedConverter<T extends { id?: string }>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = data;
      return rest;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      const data = snapshot.data();
      return {
        id: snapshot.id,
        ...data,
      } as unknown as T;
    },
  };
}

export function getTypedCollection<T extends { id?: string }>(path: string): CollectionReference<T> {
  const { db } = getFirebaseInstance();
  return collection(db, path).withConverter(createTypedConverter<T>());
}

export function getTypedDoc<T extends { id?: string }>(path: string, id: string): DocumentReference<T> {
  const { db } = getFirebaseInstance();
  return doc(db, path, id).withConverter(createTypedConverter<T>());
}
