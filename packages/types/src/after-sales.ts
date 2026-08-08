import { BaseEntity } from './common';

export type AfterSalesStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_CUSTOMER'
  | 'WAITING_COMPANY'
  | 'RESOLVED'
  | 'CLOSED';

export type AfterSalesPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type AfterSalesCategory =
  | 'REGISTRATION_DOCUMENT_DELIVERY'
  | 'PLOT_DEMARCATION'
  | 'POSSESSION_INFORMATION'
  | 'LAYOUT_DEVELOPMENT_UPDATE'
  | 'INFRASTRUCTURE_UPDATE'
  | 'CUSTOMER_SUPPORT'
  | 'PAYMENT_CLARIFICATION'
  | 'DOCUMENT_ASSISTANCE'
  | 'OTHER';

export interface AfterSalesCase extends BaseEntity {
  /** The ID of the customer associated with this case */
  customerId: string;
  
  /** The booking reference, if applicable */
  bookingId?: string;
  
  /** The registration reference, if applicable */
  registrationId?: string;
  
  /** The plot reference, if applicable */
  plotId?: string;
  
  /** The project reference, if applicable */
  projectId?: string;
  
  /** Category of the after-sales service */
  category: AfterSalesCategory | string;
  
  /** Subject of the case */
  subject: string;
  
  /** Detailed description of the request or issue */
  description: string;
  
  /** Priority level */
  priority: AfterSalesPriority;
  
  /** Current status of the case */
  status: AfterSalesStatus;
  
  /** The ID of the employee assigned to handle this case */
  assignedTo?: string;
  
  /** Timestamp when the case was opened */
  openedAt: string;
  
  /** Timestamp when the case was resolved */
  resolvedAt?: string;
  
  /** Explanation or notes regarding the resolution */
  resolution?: string;
  
  /** Any file attachments provided for this case */
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}
