import { z } from 'zod';
import { baseFirestoreModelSchema, baseCreateInputSchema } from '../../validators/base';

export const teamMemberSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  roleInTeam: z.enum(['leader', 'member', 'co_leader']).default('member'),
  joinedAt: z.string().optional(),
});

export const teamTypeEnum = z.enum(['marketing', 'sales', 'cross_functional', 'custom']);

export const teamSchema = baseFirestoreModelSchema.extend({
  companyId: z.string().min(1, 'Company ID is required'),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
  name: z.string().min(1, 'Team name is required'),
  code: z.string().min(1, 'Team code is required').transform((v) => v.toUpperCase()),
  type: teamTypeEnum,
  leaderId: z.string().optional(),
  memberIds: z.array(z.string()),
  members: z.array(teamMemberSchema).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const createTeamSchema = baseCreateInputSchema.merge(
  teamSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    version: true,
    createdBy: true,
    updatedBy: true,
    isDeleted: true,
  })
);

export const updateTeamSchema = createTeamSchema.partial();
