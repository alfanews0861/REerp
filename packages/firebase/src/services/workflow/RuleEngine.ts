import { WorkflowCondition, WorkflowConditionField } from '@real-estate-erp/types';

export class RuleEngine {
  public evaluateConditions(conditions: WorkflowCondition[], context: Record<string, unknown>): boolean {
    if (!conditions || conditions.length === 0) {
      return true; // No conditions means it evaluates to true
    }

    return conditions.every(condition => this.evaluateCondition(condition, context));
  }

  private evaluateCondition(condition: WorkflowCondition, context: Record<string, unknown>): boolean {
    const { field, operator, value } = condition;
    const contextValue = this.extractValueFromContext(field, context);

    if (contextValue === undefined) {
      return false;
    }

    switch (operator) {
      case 'EQUALS':
        return contextValue === value;
      case 'NOT_EQUALS':
        return contextValue !== value;
      case 'GREATER_THAN':
        return contextValue != null && (contextValue as any) > (value as any);
      case 'LESS_THAN':
        return contextValue != null && (contextValue as any) < (value as any);
      case 'IN':
        return Array.isArray(value) && value.includes(contextValue);
      case 'NOT_IN':
        return Array.isArray(value) && !value.includes(contextValue);
      case 'CONTAINS':
        if (typeof contextValue === 'string') {
          return contextValue.includes(value as string);
        } else if (Array.isArray(contextValue)) {
          return contextValue.includes(value);
        }
        return false;
      default:
        return false;
    }
  }

  private extractValueFromContext(field: WorkflowConditionField, context: Record<string, unknown>): unknown {
    // Map the WorkflowConditionField to the actual context key
    const fieldMapping: Record<WorkflowConditionField, string> = {
      'ROLE': 'user.roleId',
      'DEPARTMENT': 'user.departmentId',
      'BRANCH': 'user.branchId',
      'PROJECT': 'entity.projectId',
      'LEAD_SCORE': 'entity.score',
      'CAMPAIGN_SOURCE': 'entity.source',
      'BOOKING_AMOUNT': 'entity.totalPlotAmount',
      'PAYMENT_STATUS': 'entity.paymentStatus',
    };

    const path = fieldMapping[field];
    if (!path) return undefined;

    return this.resolvePath(path, context);
  }

  private resolvePath(path: string, obj: Record<string, unknown>): unknown {
    return path.split('.').reduce((acc: any, part: string) => acc && acc[part], obj);
  }
}
