import {
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  QueryConstraint,
  CollectionReference,
  FirestoreDataConverter,
} from 'firebase/firestore';
import { BaseFirestoreModel, CreateModelInput, UpdateModelInput } from '../models/base';
import { IBaseRepository, SearchOptions } from './interfaces/IBaseRepository';
import { getTypedCollectionRef, getTypedDocRef } from '../collections/collectionRefs';
import { CollectionName } from '../constants/collections';
import { PaginationOptions, PaginatedResult, QueryHelperService } from '../services/queryHelperService';
import { AuditLoggerService } from '../services/auditLoggerService';
import { TimestampService } from '../services/timestampService';

export abstract class BaseRepository<T extends BaseFirestoreModel> implements IBaseRepository<T> {
  protected readonly collectionName: CollectionName | string;
  protected readonly entityName: string;
  protected readonly converter?: FirestoreDataConverter<T>;

  constructor(collectionName: CollectionName | string, entityName: string, converter?: FirestoreDataConverter<T>) {
    this.collectionName = collectionName;
    this.entityName = entityName;
    this.converter = converter;
  }

  protected get collectionRef(): CollectionReference<T> {
    return getTypedCollectionRef<T>(this.collectionName, this.converter);
  }

  protected getDocRef(id: string) {
    return getTypedDocRef<T>(this.collectionName, id, this.converter);
  }

  public async findById(id: string): Promise<T | null> {
    const docRef = this.getDocRef(id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data();
    if (data.isDeleted) {
      return null;
    }
    return data;
  }

  public async findAll(constraints: QueryConstraint[] = [], includeDeleted: boolean = false): Promise<T[]> {
    const allConstraints: QueryConstraint[] = [...constraints];
    if (!includeDeleted) {
      allConstraints.push(where('isDeleted', '==', false));
    }
    const q = query(this.collectionRef, ...allConstraints);
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data());
  }

  public async findPaginated(
    options: PaginationOptions = {},
    constraints: QueryConstraint[] = []
  ): Promise<PaginatedResult<T>> {
    return QueryHelperService.executePaginatedQuery<T>(this.collectionRef, options, constraints);
  }

  public async search(
    options: SearchOptions<T>,
    constraints: QueryConstraint[] = []
  ): Promise<PaginatedResult<T>> {
    const paginated = await this.findPaginated({ ...options.pagination, pageSize: 100 }, constraints);
    const filteredItems = QueryHelperService.filterBySearchTerm<T>(
      paginated.items,
      options.term,
      options.fields
    );

    const pageSize = options.pagination?.pageSize || 20;
    const page = options.pagination?.page || 1;
    const startIndex = (page - 1) * pageSize;
    const pagedItems = filteredItems.slice(startIndex, startIndex + pageSize);

    return {
      items: pagedItems,
      total: filteredItems.length,
      page,
      pageSize,
      hasMore: startIndex + pageSize < filteredItems.length,
    };
  }

  public async create(input: CreateModelInput<T>, userId: string): Promise<T> {
    const now = TimestampService.nowIso();
    const docRef = input.id ? this.getDocRef(input.id) : doc(this.collectionRef);
    const id = docRef.id;

    const fullData = {
      ...input,
      id,
      createdAt: input.createdAt || now,
      updatedAt: input.updatedAt || now,
      createdBy: userId,
      updatedBy: userId,
      isActive: input.isActive ?? true,
      isDeleted: false,
      version: 1,
    } as unknown as T;

    await setDoc(docRef, fullData);

    await AuditLoggerService.log({
      userId,
      entityType: this.entityName,
      entityId: id,
      action: 'create',
      newState: fullData as unknown as Record<string, unknown>,
    });

    return fullData;
  }

  public async update(id: string, input: UpdateModelInput<T>, userId: string): Promise<T> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`${this.entityName} with ID ${id} not found.`);
    }

    const now = TimestampService.nowIso();
    const nextVersion = (existing.version || 1) + 1;

    const updateData: Record<string, unknown> = {
      ...input,
      updatedAt: now,
      updatedBy: userId,
      version: nextVersion,
    };

    const docRef = this.getDocRef(id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateDoc(docRef, updateData as any);

    const updatedEntity = {
      ...existing,
      ...updateData,
    } as T;

    await AuditLoggerService.log({
      userId,
      entityType: this.entityName,
      entityId: id,
      action: 'update',
      previousState: existing as unknown as Record<string, unknown>,
      newState: updatedEntity as unknown as Record<string, unknown>,
    });

    return updatedEntity;
  }

  public async softDelete(id: string, userId: string): Promise<boolean> {
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    const now = TimestampService.nowIso();
    const docRef = this.getDocRef(id);

    await updateDoc(docRef, {
      isDeleted: true,
      isActive: false,
      updatedAt: now,
      updatedBy: userId,
      version: (existing.version || 1) + 1,
    });

    await AuditLoggerService.log({
      userId,
      entityType: this.entityName,
      entityId: id,
      action: 'soft_delete',
      previousState: existing as unknown as Record<string, unknown>,
    });

    return true;
  }

  public async restore(id: string, userId: string): Promise<T> {
    const docRef = this.getDocRef(id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      throw new Error(`${this.entityName} with ID ${id} not found.`);
    }

    const existing = snap.data();
    const now = TimestampService.nowIso();
    const nextVersion = (existing.version || 1) + 1;

    const updateData = {
      isDeleted: false,
      isActive: true,
      updatedAt: now,
      updatedBy: userId,
      version: nextVersion,
    };

    await updateDoc(docRef, updateData);

    const restored = {
      ...existing,
      ...updateData,
    } as T;

    await AuditLoggerService.log({
      userId,
      entityType: this.entityName,
      entityId: id,
      action: 'restore',
      previousState: existing as unknown as Record<string, unknown>,
      newState: restored as unknown as Record<string, unknown>,
    });

    return restored;
  }

  public async hardDelete(id: string, userId: string): Promise<boolean> {
    const docRef = this.getDocRef(id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return false;
    }
    const previousState = snap.data();

    await deleteDoc(docRef);

    await AuditLoggerService.log({
      userId,
      entityType: this.entityName,
      entityId: id,
      action: 'hard_delete',
      previousState: previousState as unknown as Record<string, unknown>,
    });

    return true;
  }

  public async exists(id: string): Promise<boolean> {
    const snap = await getDoc(this.getDocRef(id));
    return snap.exists() && !snap.data().isDeleted;
  }
}
