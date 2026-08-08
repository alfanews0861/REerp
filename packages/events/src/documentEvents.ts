import { Event, AggregateType } from './types/event';
import { DocumentRecord } from '@real-estate-erp/types';

export enum DocumentEventType {
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_UPDATED = 'DOCUMENT_UPDATED',
  DOCUMENT_PUBLISHED = 'DOCUMENT_PUBLISHED',
  DOCUMENT_REJECTED = 'DOCUMENT_REJECTED',
  DOCUMENT_EXPIRED = 'DOCUMENT_EXPIRED',
}

export interface DocumentUploadedEvent extends Event<DocumentRecord> {
  aggregateType: AggregateType.Document;
  eventType: DocumentEventType.DOCUMENT_UPLOADED;
}

export interface DocumentPublishedEvent extends Event<{ documentId: string, visibility: string }> {
  aggregateType: AggregateType.Document;
  eventType: DocumentEventType.DOCUMENT_PUBLISHED;
}
