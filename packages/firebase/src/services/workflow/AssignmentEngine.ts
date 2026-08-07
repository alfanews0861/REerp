import { WorkflowAction, WorkflowAssignment } from '@real-estate-crm/types';
import { TimestampService } from '../timestampService';

export class AssignmentEngine {
  public executeAssignments(actions: WorkflowAction[], userId: string): WorkflowAssignment[] {
    const assignments: WorkflowAssignment[] = [];
    
    for (const action of actions) {
      if (action.type === 'ASSIGN_USER') {
        assignments.push({
          userId: action.payload.userId,
          assignedAt: TimestampService.nowIso(),
          assignedBy: userId,
        });
      } else if (action.type === 'ASSIGN_TEAM') {
        assignments.push({
          teamId: action.payload.teamId,
          assignedAt: TimestampService.nowIso(),
          assignedBy: userId,
        });
      }
    }

    return assignments;
  }
}
