import { Interaction } from '@real-estate-erp/types';
import { BaseFirestoreModel } from './base';
import { createBaseConverter } from '../converters/baseConverter';

export interface InteractionModel extends BaseFirestoreModel, Omit<Interaction, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'isActive' | 'isDeleted' | 'version'> {}

export const interactionConverter = createBaseConverter<InteractionModel>();
