import * as admin from 'firebase-admin';
import { CommissionPoolModel, CommissionRecordModel, CommissionRuleModel } from '@real-estate-erp/firebase/src/models/commission';
import { NetworkMemberModel } from '@real-estate-erp/firebase/src/models/network';
import {
  ICommissionPoolRepository,
  ICommissionRecordRepository,
  ICommissionRuleRepository,
  INetworkMemberRepository,
  QueryFilter
} from '@real-estate-erp/firebase/src/repositories/interfaces/serviceInterfaces';
import { FIRESTORE_COLLECTIONS } from '@real-estate-erp/firebase/src/constants/collections';

function applyFilters(query: admin.firestore.Query, filters?: QueryFilter[]): admin.firestore.Query {
  if (!filters) return query;
  let q = query;
  for (const filter of filters) {
    q = q.where(filter.field, filter.op as any, filter.value);
  }
  return q;
}

export class AdminCommissionPoolRepository implements ICommissionPoolRepository {
  private db = admin.firestore();
  
  async findAll(filters?: QueryFilter[]): Promise<CommissionPoolModel[]> {
    let query: admin.firestore.Query = this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_POOLS);
    query = applyFilters(query, filters);
    const snap = await query.get();
    return snap.docs.map(d => d.data() as CommissionPoolModel);
  }

  async create(input: any, userId: string): Promise<CommissionPoolModel> {
    const docRef = input.id ? this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_POOLS).doc(input.id) : this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_POOLS).doc();
    const data = { ...input, id: docRef.id, createdBy: userId, updatedBy: userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await docRef.set(data);
    return data as CommissionPoolModel;
  }

  async update(id: string, input: any, userId: string): Promise<CommissionPoolModel> {
    const docRef = this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_POOLS).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) throw new Error('Not found');
    const updateData = { ...input, updatedBy: userId, updatedAt: new Date().toISOString() };
    await docRef.update(updateData);
    return { ...snap.data(), ...updateData } as CommissionPoolModel;
  }
}

export class AdminCommissionRecordRepository implements ICommissionRecordRepository {
  private db = admin.firestore();

  async findById(id: string): Promise<CommissionRecordModel | null> {
    const snap = await this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_RECORDS).doc(id).get();
    return snap.exists ? snap.data() as CommissionRecordModel : null;
  }

  async findAll(filters?: QueryFilter[]): Promise<CommissionRecordModel[]> {
    let query: admin.firestore.Query = this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_RECORDS);
    query = applyFilters(query, filters);
    const snap = await query.get();
    return snap.docs.map(d => d.data() as CommissionRecordModel);
  }

  async create(input: any, userId: string): Promise<CommissionRecordModel> {
    const docRef = input.id ? this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_RECORDS).doc(input.id) : this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_RECORDS).doc();
    const data = { ...input, id: docRef.id, createdBy: userId, updatedBy: userId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    await docRef.set(data);
    return data as CommissionRecordModel;
  }

  async update(id: string, input: any, userId: string): Promise<CommissionRecordModel> {
    const docRef = this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_RECORDS).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) throw new Error('Not found');
    const updateData = { ...input, updatedBy: userId, updatedAt: new Date().toISOString() };
    await docRef.update(updateData);
    return { ...snap.data(), ...updateData } as CommissionRecordModel;
  }
}

export class AdminCommissionRuleRepository implements ICommissionRuleRepository {
  private db = admin.firestore();
  
  async findAll(filters?: QueryFilter[]): Promise<CommissionRuleModel[]> {
    let query: admin.firestore.Query = this.db.collection(FIRESTORE_COLLECTIONS.COMMISSION_RULES);
    query = applyFilters(query, filters);
    const snap = await query.get();
    return snap.docs.map(d => d.data() as CommissionRuleModel);
  }
}

export class AdminNetworkMemberRepository implements INetworkMemberRepository {
  private db = admin.firestore();

  async findById(id: string): Promise<NetworkMemberModel | null> {
    const snap = await this.db.collection(FIRESTORE_COLLECTIONS.NETWORK_MEMBERS).doc(id).get();
    return snap.exists ? snap.data() as NetworkMemberModel : null;
  }

  async update(id: string, input: any, userId: string): Promise<NetworkMemberModel> {
    const docRef = this.db.collection(FIRESTORE_COLLECTIONS.NETWORK_MEMBERS).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) throw new Error('Not found');
    const updateData = { ...input, updatedBy: userId, updatedAt: new Date().toISOString() };
    await docRef.update(updateData);
    return { ...snap.data(), ...updateData } as NetworkMemberModel;
  }
}
