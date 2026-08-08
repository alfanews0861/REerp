import { BaseEntity, CommissionRule, CommissionPool, CommissionRecord } from '@real-estate-erp/types';
import { BaseFirestoreModel } from './base';

export interface CommissionRuleModel extends BaseFirestoreModel, Omit<CommissionRule, keyof BaseEntity> {}
export interface CommissionPoolModel extends BaseFirestoreModel, Omit<CommissionPool, keyof BaseEntity> {}
export interface CommissionRecordModel extends BaseFirestoreModel, Omit<CommissionRecord, keyof BaseEntity> {}
