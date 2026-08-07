import {
  collection,
  doc,
  CollectionReference,
  DocumentReference,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { getFirebaseInstance } from '../config';
import { FIRESTORE_COLLECTIONS, CollectionName } from '../constants/collections';
import { BaseFirestoreModel } from '../models/base';
import { createBaseConverter } from '../converters/baseConverter';

export function getTypedCollectionRef<T extends BaseFirestoreModel>(
  collectionName: CollectionName | string,
  converter?: FirestoreDataConverter<T>
): CollectionReference<T> {
  const { db } = getFirebaseInstance();
  const targetConverter = converter || createBaseConverter<T>();
  return collection(db, collectionName).withConverter(targetConverter);
}

export function getTypedDocRef<T extends BaseFirestoreModel>(
  collectionName: CollectionName | string,
  id: string,
  converter?: FirestoreDataConverter<T>
): DocumentReference<T> {
  const { db } = getFirebaseInstance();
  const targetConverter = converter || createBaseConverter<T>();
  return doc(db, collectionName, id).withConverter(targetConverter);
}

export function getTypedSubCollectionRef<T extends BaseFirestoreModel>(
  parentCollectionName: CollectionName | string,
  parentId: string,
  subCollectionName: string,
  converter?: FirestoreDataConverter<T>
): CollectionReference<T> {
  const { db } = getFirebaseInstance();
  const targetConverter = converter || createBaseConverter<T>();
  return collection(db, parentCollectionName, parentId, subCollectionName).withConverter(targetConverter);
}

export function getTypedSubDocRef<T extends BaseFirestoreModel>(
  parentCollectionName: CollectionName | string,
  parentId: string,
  subCollectionName: string,
  id: string,
  converter?: FirestoreDataConverter<T>
): DocumentReference<T> {
  const { db } = getFirebaseInstance();
  const targetConverter = converter || createBaseConverter<T>();
  return doc(db, parentCollectionName, parentId, subCollectionName, id).withConverter(targetConverter);
}

// Helpers for specific domain collection refs
export const collections = {
  companies: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.COMPANIES),
  branches: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.BRANCHES),
  roles: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.ROLES),
  permissions: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.PERMISSIONS),
  users: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.USERS),
  employees: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.EMPLOYEES),
  departments: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.DEPARTMENTS),
  projects: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.PROJECTS),
  layouts: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.LAYOUTS),
  blocks: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.BLOCKS),
  plots: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.PLOTS),
  leads: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.LEADS),
  leadSources: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.LEAD_SOURCES),
  leadActivities: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.LEAD_ACTIVITIES),
  followUps: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.FOLLOW_UPS),
  campaigns: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.CAMPAIGNS),
  campaignExpenses: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.CAMPAIGN_EXPENSES),
  customers: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.CUSTOMERS),
  bookings: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.BOOKINGS),
  payments: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.PAYMENTS),
  receipts: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.RECEIPTS),
  vehicles: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.VEHICLES),
  drivers: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.DRIVERS),
  vehicleTrips: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.VEHICLE_TRIPS),
  fuelEntries: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.FUEL_ENTRIES),
  expenses: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.EXPENSES),
  attendance: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.ATTENDANCE),
  notifications: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.NOTIFICATIONS),
  documents: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.DOCUMENTS),
  media: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.MEDIA),
  settings: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.SETTINGS),
  auditLogs: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.AUDIT_LOGS),
  aiSuggestions: () => getTypedCollectionRef(FIRESTORE_COLLECTIONS.AI_SUGGESTIONS),
};
