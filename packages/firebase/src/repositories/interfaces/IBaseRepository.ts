import { QueryConstraint } from 'firebase/firestore';
import { BaseFirestoreModel, CreateModelInput, UpdateModelInput } from '../../models/base';
import { PaginationOptions, PaginatedResult } from '../../services/queryHelperService';

export interface SearchOptions<T> {
  term: string;
  fields: (keyof T)[];
  pagination?: PaginationOptions;
}

export interface IBaseRepository<T extends BaseFirestoreModel> {
  findById(id: string): Promise<T | null>;
  findAll(constraints?: QueryConstraint[], includeDeleted?: boolean): Promise<T[]>;
  findPaginated(
    options?: PaginationOptions,
    constraints?: QueryConstraint[]
  ): Promise<PaginatedResult<T>>;
  search(options: SearchOptions<T>, constraints?: QueryConstraint[]): Promise<PaginatedResult<T>>;
  create(input: CreateModelInput<T>, userId: string): Promise<T>;
  update(id: string, input: UpdateModelInput<T>, userId: string): Promise<T>;
  softDelete(id: string, userId: string): Promise<boolean>;
  restore(id: string, userId: string): Promise<T>;
  hardDelete(id: string, userId: string): Promise<boolean>;
  exists(id: string): Promise<boolean>;
}
