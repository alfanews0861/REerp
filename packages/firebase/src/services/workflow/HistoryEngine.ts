import { WorkflowTriggerType, WorkflowActionType } from '@real-estate-erp/types';
import { WorkflowHistoryRepository } from '../../repositories/WorkflowRepository';

export class HistoryEngine {
  private historyRepository: WorkflowHistoryRepository;

  constructor() {
    this.historyRepository = new WorkflowHistoryRepository();
  }

  public async logTransition(params: {
    workflowInstanceId: string;
    entityId: string;
    fromStageId?: string;
    toStageId: string;
    triggeredByUserId: string;
    triggerType: WorkflowTriggerType;
    actionTaken?: WorkflowActionType;
    comment?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    
    // Workflow history is immutable, we only create.
    await this.historyRepository.create({
      workflowInstanceId: params.workflowInstanceId,
      entityId: params.entityId,
      fromStageId: params.fromStageId,
      toStageId: params.toStageId,
      triggeredByUserId: params.triggeredByUserId,
      triggerType: params.triggerType,
      actionTaken: params.actionTaken,
      comment: params.comment,
      metadata: params.metadata,
    }, params.triggeredByUserId);
  }

  // Prevents editing history
  public enforceImmutability() {
    // The immutability is primarily enforced in WorkflowHistoryRepository 
    // where update/softDelete/hardDelete throw errors.
  }
}
