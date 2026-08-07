import { where } from 'firebase/firestore';
import { BaseRepository } from '../../repositories/BaseRepository';
import { TeamModel, TeamType } from '../../models/organization';
import { FIRESTORE_COLLECTIONS } from '../../constants/collections';
import { teamConverter } from '../../converters/typedConverters';

export class TeamRepository extends BaseRepository<TeamModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.TEAMS, 'Team', teamConverter);
  }

  public async findByCompanyId(companyId: string, includeInactive: boolean = false): Promise<TeamModel[]> {
    const constraints = [where('companyId', '==', companyId)];
    if (!includeInactive) {
      constraints.push(where('status', '==', 'active'));
    }
    return this.findAll(constraints);
  }

  public async findByBranchId(branchId: string): Promise<TeamModel[]> {
    return this.findAll([where('branchId', '==', branchId)]);
  }

  public async findByDepartmentId(departmentId: string): Promise<TeamModel[]> {
    return this.findAll([where('departmentId', '==', departmentId)]);
  }

  public async findByType(companyId: string, type: TeamType): Promise<TeamModel[]> {
    return this.findAll([
      where('companyId', '==', companyId),
      where('type', '==', type),
    ]);
  }

  public async findByLeaderId(leaderId: string): Promise<TeamModel[]> {
    return this.findAll([where('leaderId', '==', leaderId)]);
  }

  public async findByMemberId(companyId: string, userId: string): Promise<TeamModel[]> {
    return this.findAll([
      where('companyId', '==', companyId),
      where('memberIds', 'array-contains', userId),
    ]);
  }
}
