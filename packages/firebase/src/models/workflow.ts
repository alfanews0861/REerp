import { BaseFirestoreModel } from './base';
import {
  WorkflowType,
  WorkflowStage,
  WorkflowTransition,
  WorkflowAssignment,
  WorkflowTriggerType,
  WorkflowActionType,
} from '@real-estate-erp/types';

export interface WorkflowDefinitionModel extends BaseFirestoreModel {
  name: string;
  description?: string;
  type: WorkflowType;
  entityType: string;
  stages: WorkflowStage[];
  transitions: WorkflowTransition[];
}

export interface WorkflowInstanceModel extends BaseFirestoreModel {
  workflowDefinitionId: string;
  entityId: string;
  entityType: string;
  currentStageId: string;
  assignments: WorkflowAssignment[];
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
}

export interface WorkflowHistoryModel extends BaseFirestoreModel {
  workflowInstanceId: string;
  entityId: string;
  fromStageId?: string;
  toStageId: string;
  triggeredByUserId: string;
  triggerType: WorkflowTriggerType;
  actionTaken?: WorkflowActionType;
  comment?: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowCommentModel extends BaseFirestoreModel {
  workflowInstanceId: string;
  userId: string;
  content: string;
  attachments?: { url: string; name: string }[];
}
