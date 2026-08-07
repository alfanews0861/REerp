import {
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  CollectionReference,
  getDocs,
  DocumentSnapshot,
} from 'firebase/firestore';
import { BaseFirestoreModel } from '../models/base';

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  lastDoc?: DocumentSnapshot;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  includeDeleted?: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  lastDoc?: DocumentSnapshot;
}

export class QueryHelperService {
  public static buildQueryConstraints(
    options: PaginationOptions = {},
    filters: QueryConstraint[] = []
  ): QueryConstraint[] {
    const constraints: QueryConstraint[] = [...filters];

    if (!options.includeDeleted) {
      constraints.push(where('isDeleted', '==', false));
    }

    const sortField = options.sortBy || 'createdAt';
    const sortDir = options.sortDirection || 'desc';
    constraints.push(orderBy(sortField, sortDir));

    if (options.lastDoc) {
      constraints.push(startAfter(options.lastDoc));
    }

    if (options.pageSize) {
      constraints.push(limit(options.pageSize));
    }

    return constraints;
  }

  public static async executePaginatedQuery<T extends BaseFirestoreModel>(
    collectionRef: CollectionReference<T>,
    options: PaginationOptions = {},
    filters: QueryConstraint[] = []
  ): Promise<PaginatedResult<T>> {
    const pageSize = options.pageSize || 20;
    const page = options.page || 1;

    const queryConstraints = QueryHelperService.buildQueryConstraints(
      { ...options, pageSize: pageSize + 1 },
      filters
    );

    const q = query(collectionRef, ...queryConstraints);
    const snapshot = await getDocs(q);

    const hasMore = snapshot.docs.length > pageSize;
    const docs = hasMore ? snapshot.docs.slice(0, pageSize) : snapshot.docs;
    const items = docs.map((docSnap) => docSnap.data());
    const lastDoc = docs.length > 0 ? docs[docs.length - 1] : undefined;

    return {
      items,
      total: items.length,
      page,
      pageSize,
      hasMore,
      lastDoc,
    };
  }

  public static filterBySearchTerm<T>(
    items: T[],
    searchTerm: string,
    searchFields: (keyof T)[]
  ): T[] {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();

    return items.filter((item) =>
      searchFields.some((field) => {
        const val = item[field];
        if (typeof val === 'string') {
          return val.toLowerCase().includes(term);
        }
        if (typeof val === 'number') {
          return val.toString().includes(term);
        }
        return false;
      })
    );
  }
}
