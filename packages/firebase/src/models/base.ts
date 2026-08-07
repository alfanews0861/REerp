export interface BaseFirestoreModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDeleted: boolean;
  version: number;
}

export type CreateModelInput<T extends BaseFirestoreModel> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt' | 'version'
> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
};

export type UpdateModelInput<T extends BaseFirestoreModel> = Partial<
  Omit<T, 'id' | 'createdAt' | 'version'>
>;
