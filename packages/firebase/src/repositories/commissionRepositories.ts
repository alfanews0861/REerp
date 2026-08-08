import { BaseRepository } from '../BaseRepository';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import {
  CommissionRuleModel,
  CommissionPoolModel,
  CommissionRecordModel,
} from '../../models/commission';
import {
  commissionRuleConverter,
  commissionPoolConverter,
  commissionRecordConverter,
} from '../../converters/typedConverters';

export class CommissionRuleRepository extends BaseRepository<CommissionRuleModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_RULES, 'CommissionRule', commissionRuleConverter);
  }
}

export class CommissionPoolRepository extends BaseRepository<CommissionPoolModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_POOLS, 'CommissionPool', commissionPoolConverter);
  }
}

export class CommissionRecordRepository extends BaseRepository<CommissionRecordModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.COMMISSION_RECORDS, 'CommissionRecord', commissionRecordConverter);
  }
}
