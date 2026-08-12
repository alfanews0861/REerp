import { BaseRepository } from './BaseRepository';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';
import { where, QueryConstraint } from 'firebase/firestore';
import {
  CommissionRuleModel,
  CommissionPoolModel,
  CommissionRecordModel,
} from '../models/commission';
import {
  commissionRuleConverter,
  commissionPoolConverter,
  commissionRecordConverter,
} from '../converters/typedConverters';
import {
  ICommissionRuleRepository,
  ICommissionPoolRepository,
  ICommissionRecordRepository,
  QueryFilter
} from './interfaces/serviceInterfaces';

function toConstraints(filters?: QueryFilter[]): QueryConstraint[] {
  if (!filters) return [];
  return filters.map(f => where(f.field, f.op as any, f.value));
}

export class CommissionRuleRepository extends BaseRepository<CommissionRuleModel> implements ICommissionRuleRepository {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_RULES, 'CommissionRule', commissionRuleConverter);
  }
  async findAll(filters?: QueryFilter[]): Promise<CommissionRuleModel[]> {
    return super.findAll(toConstraints(filters));
  }
}

export class CommissionPoolRepository extends BaseRepository<CommissionPoolModel> implements ICommissionPoolRepository {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_POOLS, 'CommissionPool', commissionPoolConverter);
  }
  async findAll(filters?: QueryFilter[]): Promise<CommissionPoolModel[]> {
    return super.findAll(toConstraints(filters));
  }
}

export class CommissionRecordRepository extends BaseRepository<CommissionRecordModel> implements ICommissionRecordRepository {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_RECORDS, 'CommissionRecord', commissionRecordConverter);
  }
  async findAll(filters?: QueryFilter[]): Promise<CommissionRecordModel[]> {
    return super.findAll(toConstraints(filters));
  }
}
