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

function isQueryFilterArray(arr?: any[]): arr is QueryFilter[] {
  if (!arr || arr.length === 0) return false;
  return typeof arr[0] === 'object' && arr[0] !== null && 'field' in arr[0] && 'op' in arr[0];
}

export class CommissionRuleRepository extends BaseRepository<CommissionRuleModel> implements ICommissionRuleRepository {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_RULES, 'CommissionRule', commissionRuleConverter);
  }
  override async findAll(
    filtersOrConstraints?: QueryFilter[] | QueryConstraint[],
    includeDeleted: boolean = false
  ): Promise<CommissionRuleModel[]> {
    if (isQueryFilterArray(filtersOrConstraints)) {
      return super.findAll(toConstraints(filtersOrConstraints), includeDeleted);
    }
    return super.findAll(filtersOrConstraints as QueryConstraint[] | undefined, includeDeleted);
  }
}

export class CommissionPoolRepository extends BaseRepository<CommissionPoolModel> implements ICommissionPoolRepository {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_POOLS, 'CommissionPool', commissionPoolConverter);
  }
  override async findAll(
    filtersOrConstraints?: QueryFilter[] | QueryConstraint[],
    includeDeleted: boolean = false
  ): Promise<CommissionPoolModel[]> {
    if (isQueryFilterArray(filtersOrConstraints)) {
      return super.findAll(toConstraints(filtersOrConstraints), includeDeleted);
    }
    return super.findAll(filtersOrConstraints as QueryConstraint[] | undefined, includeDeleted);
  }
}

export class CommissionRecordRepository extends BaseRepository<CommissionRecordModel> implements ICommissionRecordRepository {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_RECORDS, 'CommissionRecord', commissionRecordConverter);
  }
  override async findAll(
    filtersOrConstraints?: QueryFilter[] | QueryConstraint[],
    includeDeleted: boolean = false
  ): Promise<CommissionRecordModel[]> {
    if (isQueryFilterArray(filtersOrConstraints)) {
      return super.findAll(toConstraints(filtersOrConstraints), includeDeleted);
    }
    return super.findAll(filtersOrConstraints as QueryConstraint[] | undefined, includeDeleted);
  }
}

