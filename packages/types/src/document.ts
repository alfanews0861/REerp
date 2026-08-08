import { BaseEntity } from './common';

export type DocumentVisibility =
  | 'INTERNAL'
  | 'CUSTOMER_VISIBLE'
  | 'AGENT_VISIBLE'
  | 'MANAGEMENT_ONLY';

export type DocumentStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

export type DocumentCategory =
  | 'PROJECT_DOCUMENT'
  | 'LAYOUT_DOCUMENT'
  | 'PLOT_DOCUMENT'
  | 'CUSTOMER_DOCUMENT'
  | 'BOOKING_DOCUMENT'
  | 'PAYMENT_DOCUMENT'
  | 'REGISTRATION_DOCUMENT'
  | 'AFTER_SALES_DOCUMENT'
  | 'OTHER';

export interface DocumentRecord extends BaseEntity {
  /** The type of entity this document is attached to (e.g., 'Person', 'Booking', 'Project') */
  entityType: string;
  
  /** The ID of the entity */
  entityId: string;
  
  /** Categorization of the document */
  category: DocumentCategory | string;
  
  /** User-facing title of the document */
  title: string;
  
  /** Optional description */
  description?: string;
  
  /** URI/URL/Path to the stored file */
  fileReference: string;
  
  /** MIME type or extension */
  fileType: string;
  
  /** File size in bytes */
  fileSize?: number;
  
  /** The user ID who uploaded it */
  uploadedBy: string;
  
  /** When it was uploaded */
  uploadedAt: string;
  
  /** Visibility rules for RBAC and Customer Portal */
  visibility: DocumentVisibility;
  
  /** Current version number. Defaults to 1. */
  version: number;
  
  /** If this document replaced an older one, ID of the previous version */
  previousVersionId?: string;
  
  /** Verification status */
  status: DocumentStatus;
  
  /** Optional notes by verifiers */
  notes?: string;
}
