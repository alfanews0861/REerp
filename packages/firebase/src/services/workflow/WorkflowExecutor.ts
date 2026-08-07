import { 
  WorkflowDefinitionRepository, 
  WorkflowInstanceRepository 
} from '../../repositories/WorkflowRepository';
import { RuleEngine } from './RuleEngine';
import { AssignmentEngine } from './AssignmentEngine';
import { HistoryEngine } from './HistoryEngine';
import { WorkflowAction, WorkflowTriggerType } from '@real-estate-crm/types';

export class WorkflowExecutor {
  private definitionRepo: WorkflowDefinitionRepository;
  private instanceRepo: WorkflowInstanceRepository;
  private ruleEngine: RuleEngine;
  private assignmentEngine: AssignmentEngine;
  private historyEngine: HistoryEngine;

  constructor() {
    this.definitionRepo = new WorkflowDefinitionRepository();
    this.instanceRepo = new WorkflowInstanceRepository();
    this.ruleEngine = new RuleEngine();
    this.assignmentEngine = new AssignmentEngine();
    this.historyEngine = new HistoryEngine();
  }

  public async startWorkflow(definitionId: string, entityId: string, entityType: string, userId: string, context: Record<string, any>) {
    const definition = await this.definitionRepo.findById(definitionId);
    if (!definition) throw new Error('Workflow Definition not found');

    const initialStage = definition.stages.find(s => s.isInitial);
    if (!initialStage) throw new Error('Workflow has no initial stage');

    // Handle assignments if there are entry actions
    const assignments = initialStage.actionsOnEnter 
      ? this.assignmentEngine.executeAssignments(initialStage.actionsOnEnter, userId) 
      : [];

    const instance = await this.instanceRepo.create({
      workflowDefinitionId: definitionId,
      entityId,
      entityType,
      currentStageId: initialStage.id,
      assignments,
      status: 'ACTIVE',
    }, userId);

    await this.historyEngine.logTransition({
      workflowInstanceId: instance.id,
      entityId,
      toStageId: initialStage.id,
      triggeredByUserId: userId,
      triggerType: 'CREATED',
    });

    return instance;
  }

  public async triggerTransition(instanceId: string, targetStageId: string, userId: string, context: Record<string, any>) {
    const instance = await this.instanceRepo.findById(instanceId);
    if (!instance) throw new Error('Instance not found');

    const definition = await this.definitionRepo.findById(instance.workflowDefinitionId);
    if (!definition) throw new Error('Workflow Definition not found');

    const transition = definition.transitions.find(t => 
      t.fromStageId === instance.currentStageId && t.toStageId === targetStageId
    );
    if (!transition) throw new Error('Invalid transition');

    // Evaluate Rules
    if (transition.rules) {
      for (const rule of transition.rules) {
        if (!this.ruleEngine.evaluateConditions(rule.conditions, context)) {
          throw new Error(`Transition rule failed: ${rule.name}`);
        }
      }
    }

    // Process transition
    const targetStage = definition.stages.find(s => s.id === targetStageId);
    if (!targetStage) throw new Error('Target stage not found in definition');

    // Execute Assignment actions on Enter
    const newAssignments = targetStage.actionsOnEnter 
      ? this.assignmentEngine.executeAssignments(targetStage.actionsOnEnter, userId)
      : [];

    const updatedInstance = await this.instanceRepo.update(instanceId, {
      currentStageId: targetStageId,
      assignments: [...instance.assignments, ...newAssignments],
      status: targetStage.isFinal ? 'COMPLETED' : 'ACTIVE'
    }, userId);

    await this.historyEngine.logTransition({
      workflowInstanceId: instanceId,
      entityId: instance.entityId,
      fromStageId: instance.currentStageId,
      toStageId: targetStageId,
      triggeredByUserId: userId,
      triggerType: 'UPDATED',
    });

    return updatedInstance;
  }
}
