import { CommissionPoolModel, CommissionRecordModel, CommissionRuleModel } from '../../models/commission';
import { NetworkMemberModel } from '../../models/network';

export type FilterOp = '==' | 'in' | 'array-contains' | '<' | '<=' | '>' | '>=';

export interface QueryFilter {
  field: string;
  op: FilterOp;
  value: any;
}

export interface ICommissionPoolRepository {
  findAll(filters?: QueryFilter[]): Promise<CommissionPoolModel[]>;
  create(input: any, userId: string): Promise<CommissionPoolModel>;
  update(id: string, input: any, userId: string): Promise<CommissionPoolModel>;
}

export interface ICommissionRecordRepository {
  findById(id: string): Promise<CommissionRecordModel | null>;
  findAll(filters?: QueryFilter[]): Promise<CommissionRecordModel[]>;
  create(input: any, userId: string): Promise<CommissionRecordModel>;
  update(id: string, input: any, userId: string): Promise<CommissionRecordModel>;
}

export interface ICommissionRuleRepository {
  findAll(filters?: QueryFilter[]): Promise<CommissionRuleModel[]>;
}

export interface INetworkMemberRepository {
  findById(id: string): Promise<NetworkMemberModel | null>;
  update(id: string, input: any, userId: string): Promise<NetworkMemberModel>;
  findDescendants?(memberId: string): Promise<NetworkMemberModel[]>;
  findAll?(constraints?: any[]): Promise<NetworkMemberModel[]>;
}
