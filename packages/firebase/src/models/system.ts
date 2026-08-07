import { BaseFirestoreModel } from './base';

export interface NotificationModel extends BaseFirestoreModel {
  userId: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  isRead: boolean;
  readAt?: string;
  link?: string;
  data?: Record<string, unknown>;
}

export interface DocumentModel extends BaseFirestoreModel {
  companyId: string;
  entityType: string;
  entityId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category?: string;
}

export interface MediaModel extends BaseFirestoreModel {
  companyId: string;
  title: string;
  url: string;
  mimeType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  tags: string[];
}

export interface SettingModel extends BaseFirestoreModel {
  companyId?: string;
  key: string;
  value: unknown;
  category: string;
  description?: string;
  isPublic: boolean;
}

export interface AuditLogModel extends BaseFirestoreModel {
  companyId?: string;
  userId: string;
  entityType: string;
  entityId: string;
  action: 'create' | 'update' | 'soft_delete' | 'restore' | 'hard_delete';
  previousState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AISuggestionModel extends BaseFirestoreModel {
  companyId: string;
  userId?: string;
  targetType: 'lead' | 'pricing' | 'marketing' | 'workflow';
  targetId?: string;
  prompt: string;
  suggestionText: string;
  confidenceScore: number;
  status: 'pending' | 'accepted' | 'rejected' | 'applied';
  feedback?: string;
}
