// import { z } from 'zod';
import { BaseEntity } from './common';

export type WorkflowType = 
  | 'LEAD_WORKFLOW'
  | 'SITE_VISIT_WORKFLOW'
  | 'BOOKING_WORKFLOW'
  | 'PAYMENT_WORKFLOW'
  | 'REGISTRATION_WORKFLOW'
  | 'CAMPAIGN_WORKFLOW'
  | 'APPROVAL_WORKFLOW'
  | 'EXPENSE_APPROVAL_WORKFLOW'
  | 'LEAVE_APPROVAL_WORKFLOW'
  | 'VEHICLE_APPROVAL_WORKFLOW';

export type WorkflowTriggerType = 
  | 'CREATED'
  | 'UPDATED'
  | 'ASSIGNED'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export type WorkflowActionType = 
  | 'ASSIGN_USER'
  | 'ASSIGN_TEAM'
  | 'SEND_NOTIFICATION'
  | 'CREATE_TASK'
  | 'CREATE_REMINDER'
  | 'SCHEDULE_FOLLOW_UP'
  | 'UPDATE_STATUS'
  | 'RUN_CLOUD_FUNCTION';

export type WorkflowConditionField = 
  | 'ROLE'
  | 'DEPARTMENT'
  | 'BRANCH'
  | 'PROJECT'
  | 'LEAD_SCORE'
  | 'CAMPAIGN_SOURCE'
  | 'BOOKING_AMOUNT'
  | 'PAYMENT_STATUS';

export type WorkflowConditionOperator = 
  | 'EQUALS' 
  | 'NOT_EQUALS' 
  | 'GREATER_THAN' 
  | 'LESS_THAN' 
  | 'IN' 
  | 'NOT_IN' 
  | 'CONTAINS';

export interface WorkflowCondition {
  field: WorkflowConditionField;
  operator: WorkflowConditionOperator;
  value: unknown;
}

export interface WorkflowAction {
  type: WorkflowActionType;
  payload: Record<string, unknown>;
}

export interface WorkflowRule {
  id: string;
  name: string;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
}

export interface WorkflowTransition {
  fromStageId: string;
  toStageId: string;
  allowedRoles?: string[]; // If empty, anyone with access can transition
  rules?: WorkflowRule[]; // Rules evaluated upon transition
  requireComment?: boolean;
}

export interface WorkflowStage {
  id: string;
  name: string;
  isInitial?: boolean;
  isFinal?: boolean;
  actionsOnEnter?: WorkflowAction[];
  actionsOnExit?: WorkflowAction[];
}

// 1. Definition
export interface WorkflowDefinition extends BaseEntity {
  name: string;
  description?: string;
  type: WorkflowType;
  entityType: string; // The collection name this applies to
  stages: WorkflowStage[];
  transitions: WorkflowTransition[];
  isActive: boolean;
  isDeleted: boolean;
  version: number;
}

// 2. Assignment
export interface WorkflowAssignment {
  userId?: string;
  teamId?: string;
  roleId?: string;
  assignedAt: string;
  assignedBy: string;
}

// 3. Active Instance
export interface WorkflowInstance extends BaseEntity {
  workflowDefinitionId: string;
  entityId: string;
  entityType: string;
  currentStageId: string;
  assignments: WorkflowAssignment[];
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  isActive: boolean;
  isDeleted: boolean;
  version: number;
}

// 4. History (Immutable)
export interface WorkflowHistory extends BaseEntity {
  workflowInstanceId: string;
  entityId: string;
  fromStageId?: string;
  toStageId: string;
  triggeredByUserId: string;
  triggerType: WorkflowTriggerType;
  actionTaken?: WorkflowActionType;
  comment?: string;
  metadata?: Record<string, unknown>;
  isActive: boolean;
  isDeleted: boolean;
  version: number;
}

// 5. Comment
export interface WorkflowComment extends BaseEntity {
  workflowInstanceId: string;
  userId: string;
  content: string;
  attachments?: { url: string; name: string }[];
  isActive: boolean;
  isDeleted: boolean;
  version: number;
}

// 6. Approval Specific Types
export interface ApprovalStep {
  stageId: string;
  approverUserId?: string;
  approverRoleId?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comment?: string;
  actionDate?: string;
}

// Zod Schemas
/*
export const workflowConditionSchema = z.object({
  field: z.enum([
    'ROLE', 'DEPARTMENT', 'BRANCH', 'PROJECT', 'LEAD_SCORE', 
    'CAMPAIGN_SOURCE', 'BOOKING_AMOUNT', 'PAYMENT_STATUS'
  ]),
  operator: z.enum([
    'EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'IN', 'NOT_IN', 'CONTAINS'
  ]),
  value: z.any(),
});

export const workflowActionSchema = z.object({
  type: z.enum([
    'ASSIGN_USER', 'ASSIGN_TEAM', 'SEND_NOTIFICATION', 'CREATE_TASK', 
    'CREATE_REMINDER', 'SCHEDULE_FOLLOW_UP', 'UPDATE_STATUS', 'RUN_CLOUD_FUNCTION'
  ]),
  payload: z.record(z.any()),
});

export const workflowRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  conditions: z.array(workflowConditionSchema),
  actions: z.array(workflowActionSchema),
});

export const workflowStageSchema = z.object({
  id: z.string(),
  name: z.string(),
  isInitial: z.boolean().optional(),
  isFinal: z.boolean().optional(),
  actionsOnEnter: z.array(workflowActionSchema).optional(),
  actionsOnExit: z.array(workflowActionSchema).optional(),
});

export const workflowTransitionSchema = z.object({
  fromStageId: z.string(),
  toStageId: z.string(),
  allowedRoles: z.array(z.string()).optional(),
  rules: z.array(workflowRuleSchema).optional(),
  requireComment: z.boolean().optional(),
});
*/
