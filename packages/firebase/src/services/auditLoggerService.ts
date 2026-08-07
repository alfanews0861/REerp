import { addDoc, collection } from 'firebase/firestore';
import { getFirebaseInstance } from '../config';
import { FIRESTORE_COLLECTIONS } from '../constants/collections';
import { AuditLogModel } from '../models/system';

export interface AuditLogOptions {
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

export class AuditLoggerService {
  public static async log(options: AuditLogOptions): Promise<void> {
    try {
      const { db } = getFirebaseInstance();
      const auditLogCollection = collection(db, FIRESTORE_COLLECTIONS.AUDIT_LOGS);
      const now = new Date().toISOString();

      const logData: Omit<AuditLogModel, 'id'> = {
        companyId: options.companyId,
        userId: options.userId,
        entityType: options.entityType,
        entityId: options.entityId,
        action: options.action,
        previousState: options.previousState,
        newState: options.newState,
        ipAddress: options.ipAddress,
        userAgent: options.userAgent,
        createdAt: now,
        updatedAt: now,
        createdBy: options.userId,
        updatedBy: options.userId,
        isActive: true,
        isDeleted: false,
        version: 1,
      };

      await addDoc(auditLogCollection, logData);
    } catch (error) {
      console.error('Failed to write audit log entry:', error);
      // Non-blocking for primary application flows
    }
  }
}
