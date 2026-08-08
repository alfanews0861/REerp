import { BaseEntity } from './common';

export type NotificationType = 
  | 'BOOKING_CONFIRMATION'
  | 'PAYMENT_RECEIVED'
  | 'FULL_PAYMENT_COMPLETED'
  | 'REGISTRATION_COMPLETED'
  | 'DOCUMENT_PUBLISHED'
  | 'AFTER_SALES_UPDATE'
  | 'SUPPORT_RESPONSE'
  | 'SYSTEM_ALERT'
  | 'PROMOTIONAL';

export interface CustomerNotification extends BaseEntity {
  /** The ID of the target customer */
  userId: string;
  
  /** Title of the notification */
  title: string;
  
  /** Body text of the notification */
  message: string;
  
  /** Category of the notification */
  type: NotificationType;
  
  /** Whether the notification has been read by the customer */
  read: boolean;
  
  /** Timestamp when the notification was read */
  readAt?: string;
  
  /** Any additional data for routing or context */
  metadata?: Record<string, any>;
}
