import { UserProfile } from '@real-estate-erp/types';
import { TeamRepository } from '../repositories/TeamRepository';
import { TeamModel, TeamType, TeamMember } from '../../models/organization';
import { createTeamSchema, updateTeamSchema } from '../validators/teamSchema';
import { OrganizationCacheService } from './OrganizationCacheService';
import { PermissionService } from '../../authorization/permissionService';

export class TeamService {
  private teamRepo: TeamRepository;

  constructor(teamRepo: TeamRepository = new TeamRepository()) {
    this.teamRepo = teamRepo;
  }

  private validatePermission(user: UserProfile | null, permission: string): void {
    if (user && !PermissionService.can(user, permission)) {
      throw new Error(`Permission denied: User does not have permission '${permission}'`);
    }
  }

  public async getTeam(teamId: string, currentUser: UserProfile | null = null): Promise<TeamModel | null> {
    this.validatePermission(currentUser, 'team:read');

    const cacheKey = `team:${teamId}`;
    const cached = OrganizationCacheService.get<TeamModel>(cacheKey);
    if (cached) return cached;

    const team = await this.teamRepo.findById(teamId);
    if (team) {
      OrganizationCacheService.set(cacheKey, team);
    }
    return team;
  }

  public async getTeamsByCompany(
    companyId: string,
    includeInactive: boolean = false,
    currentUser: UserProfile | null = null
  ): Promise<TeamModel[]> {
    this.validatePermission(currentUser, 'team:read');
    return this.teamRepo.findByCompanyId(companyId, includeInactive);
  }

  public async getTeamsByType(
    companyId: string,
    type: TeamType,
    currentUser: UserProfile | null = null
  ): Promise<TeamModel[]> {
    this.validatePermission(currentUser, 'team:read');
    return this.teamRepo.findByType(companyId, type);
  }

  public async createTeam(
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<TeamModel> {
    this.validatePermission(currentUser, 'team:create');

    const validated = createTeamSchema.parse(input);
    const created = await this.teamRepo.create(validated as Omit<TeamModel, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'createdBy' | 'updatedBy' | 'isDeleted' | 'isActive'>, userId);

    OrganizationCacheService.set(`team:${created.id}`, created);
    return created;
  }

  public async updateTeam(
    teamId: string,
    input: unknown,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<TeamModel> {
    this.validatePermission(currentUser, 'team:update');

    const validated = updateTeamSchema.parse(input);
    const updated = await this.teamRepo.update(teamId, validated, userId);

    OrganizationCacheService.set(`team:${teamId}`, updated);
    return updated;
  }

  public async assignTeamLeader(
    teamId: string,
    leaderId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<TeamModel> {
    this.validatePermission(currentUser, 'team:update');

    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new Error(`Team with ID '${teamId}' not found.`);
    }

    const memberIds = Array.from(new Set([...team.memberIds, leaderId]));
    const existingMembers = team.members || [];
    const updatedMembers: TeamMember[] = existingMembers.map((m) =>
      m.userId === leaderId ? { ...m, roleInTeam: 'leader' as const } : m
    );

    if (!updatedMembers.some((m) => m.userId === leaderId)) {
      updatedMembers.push({
        userId: leaderId,
        roleInTeam: 'leader',
        joinedAt: new Date().toISOString(),
      });
    }

    return this.updateTeam(teamId, { leaderId, memberIds, members: updatedMembers }, userId, currentUser);
  }

  public async addTeamMember(
    teamId: string,
    memberId: string,
    roleInTeam: 'leader' | 'member' | 'co_leader' = 'member',
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<TeamModel> {
    this.validatePermission(currentUser, 'team:update');

    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new Error(`Team with ID '${teamId}' not found.`);
    }

    const memberIds = Array.from(new Set([...team.memberIds, memberId]));
    const members = team.members || [];
    const updatedMembers = members.filter((m) => m.userId !== memberId);
    updatedMembers.push({
      userId: memberId,
      roleInTeam,
      joinedAt: new Date().toISOString(),
    });

    return this.updateTeam(teamId, { memberIds, members: updatedMembers }, userId, currentUser);
  }

  public async removeTeamMember(
    teamId: string,
    memberId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<TeamModel> {
    this.validatePermission(currentUser, 'team:update');

    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new Error(`Team with ID '${teamId}' not found.`);
    }

    const memberIds = team.memberIds.filter((id) => id !== memberId);
    const members = (team.members || []).filter((m) => m.userId !== memberId);
    const leaderId = team.leaderId === memberId ? undefined : team.leaderId;

    return this.updateTeam(teamId, { memberIds, members, leaderId }, userId, currentUser);
  }

  public async softDeleteTeam(
    teamId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<boolean> {
    this.validatePermission(currentUser, 'team:delete');

    const success = await this.teamRepo.softDelete(teamId, userId);
    if (success) {
      OrganizationCacheService.invalidate(`team:${teamId}`);
    }
    return success;
  }

  public async restoreTeam(
    teamId: string,
    userId: string,
    currentUser: UserProfile | null = null
  ): Promise<TeamModel> {
    this.validatePermission(currentUser, 'team:update');

    const restored = await this.teamRepo.restore(teamId, userId);
    OrganizationCacheService.set(`team:${teamId}`, restored);
    return restored;
  }
}
