import { WorkflowInstanceRepository } from '../../repositories/WorkflowRepository';
import { HistoryEngine } from './HistoryEngine';

export class ApprovalEngine {
  private workflowInstanceRepository: WorkflowInstanceRepository;
  private historyEngine: HistoryEngine;

  constructor() {
    this.workflowInstanceRepository = new WorkflowInstanceRepository();
    this.historyEngine = new HistoryEngine();
  }

  public async approve(
    workflowInstanceId: string, 
    userId: string, 
    comment?: string
  ): Promise<void> {
    const instance = await this.workflowInstanceRepository.findById(workflowInstanceId);
    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    // Process approval logic based on current stage and rules...
    
    // Log immutable history
    await this.historyEngine.logTransition({
      workflowInstanceId,
      entityId: instance.entityId,
      fromStageId: instance.currentStageId,
      toStageId: instance.currentStageId, // Stays in same stage or moves to next
      triggeredByUserId: userId,
      triggerType: 'APPROVED',
      comment,
    });
  }

  public async reject(
    workflowInstanceId: string, 
    userId: string, 
    comment?: string
  ): Promise<void> {
    const instance = await this.workflowInstanceRepository.findById(workflowInstanceId);
    if (!instance) {
      throw new Error('Workflow instance not found');
    }

    // Process rejection logic...
    
    // Log immutable history
    await this.historyEngine.logTransition({
      workflowInstanceId,
      entityId: instance.entityId,
      fromStageId: instance.currentStageId,
      toStageId: instance.currentStageId, // Or return to previous stage
      triggeredByUserId: userId,
      triggerType: 'REJECTED',
      comment,
    });
  }
}
