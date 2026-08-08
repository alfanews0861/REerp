import { BaseEntity, NetworkMember, NetworkPosition, NetworkTeam } from '@real-estate-erp/types';
import { BaseFirestoreModel } from './base';

export interface NetworkMemberModel extends BaseFirestoreModel, Omit<NetworkMember, keyof BaseEntity> {}
export interface NetworkPositionModel extends BaseFirestoreModel, Omit<NetworkPosition, keyof BaseEntity> {}
export interface NetworkTeamModel extends BaseFirestoreModel, Omit<NetworkTeam, keyof BaseEntity> {}
