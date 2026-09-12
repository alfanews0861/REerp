import { BaseRepository } from './BaseRepository';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';
import {
  NetworkMemberModel,
  NetworkPositionModel,
  NetworkTeamModel,
} from '../models/network';
import {
  networkMemberConverter,
  networkPositionConverter,
  networkTeamConverter,
} from '../converters/typedConverters';
import { where } from 'firebase/firestore';
import { INetworkMemberRepository } from './interfaces/serviceInterfaces';

export class NetworkMemberRepository extends BaseRepository<NetworkMemberModel> implements INetworkMemberRepository {
  constructor() {
    super(FIRESTORE_COLLECTIONS.NETWORK_MEMBERS, 'NetworkMember', networkMemberConverter);
  }

  async findDescendants(memberId: string): Promise<NetworkMemberModel[]> {
    return this.findAll([where('ancestors', 'array-contains', memberId)]);
  }
}

export class NetworkPositionRepository extends BaseRepository<NetworkPositionModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.NETWORK_POSITIONS, 'NetworkPosition', networkPositionConverter);
  }
}

export class NetworkTeamRepository extends BaseRepository<NetworkTeamModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.NETWORK_TEAMS, 'NetworkTeam', networkTeamConverter);
  }
}
