import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { BaseEntity, Person } from '@real-estate-erp/types';
import { BaseFirestoreModel } from './base';

export interface PersonModel extends BaseFirestoreModel, Omit<Person, keyof BaseEntity> {}

export const personConverter: FirestoreDataConverter<PersonModel> = {
  toFirestore(person: PersonModel): DocumentData {
    return {
      ...person,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PersonModel {
    const data = snapshot.data(options)!;
    return {
      ...data,
      id: snapshot.id,
    } as PersonModel;
  },
};
