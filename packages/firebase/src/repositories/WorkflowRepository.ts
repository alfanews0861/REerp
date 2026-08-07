import { BaseRepository } from './BaseRepository';
import {
  WorkflowDefinitionModel,
  WorkflowInstanceModel,
  WorkflowHistoryModel,
  WorkflowCommentModel,
} from '../models/workflow';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';


export class WorkflowDefinitionRepository extends BaseRepository<WorkflowDefinitionModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.WORKFLOW_DEFINITIONS, 'WorkflowDefinition');
  }
}

export class WorkflowInstanceRepository extends BaseRepository<WorkflowInstanceModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.WORKFLOW_INSTANCES, 'WorkflowInstance');
  }
}

export class WorkflowHistoryRepository extends BaseRepository<WorkflowHistoryModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.WORKFLOW_HISTORIES, 'WorkflowHistory');
  }

  // Workflow history is immutable, override update and delete methods
  public override async update(_id: string, _input: any, _userId: string): Promise<WorkflowHistoryModel> {
    throw new Error('Workflow history is immutable and cannot be updated.');
  }

  public override async softDelete(_id: string, _userId: string): Promise<boolean> {
    throw new Error('Workflow history is immutable and cannot be deleted.');
  }

  public override async hardDelete(_id: string, _userId: string): Promise<boolean> {
    throw new Error('Workflow history is immutable and cannot be deleted.');
  }
}

export class WorkflowCommentRepository extends BaseRepository<WorkflowCommentModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.WORKFLOW_COMMENTS, 'WorkflowComment');
  }
}
