import { BaseEntity } from './common';
import { UserRole } from './permissions';
import { CadreLevel } from './cadre';

export type MessageType = 'DIRECT' | 'BROADCAST' | 'GROUP' | 'SYSTEM_NOTIFICATION';

export type MessagePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type RecipientScope = 
  | 'INDIVIDUAL' 
  | 'OFFICE_STAFF' 
  | 'MARKETING_TEAM' 
  | 'PEER_CGMS' 
  | 'ALL_COMPANY'
  | 'BRANCH';

export type ChannelCategory = 
  | 'DIRECT' 
  | 'ALL_STAFF' 
  | 'MARKETING_TEAM' 
  | 'CGM_NETWORK' 
  | 'SYSTEM'
  | 'ANNOUNCEMENTS';

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  sizeBytes?: number;
  type?: string;
}

export interface InternalMessage extends BaseEntity {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderCadre?: CadreLevel;
  senderPhotoUrl?: string;
  
  recipientType: RecipientScope;
  recipientIds?: string[];
  
  subject?: string;
  content: string;
  type: MessageType;
  priority: MessagePriority;
  attachments?: MessageAttachment[];
  
  readBy: string[]; // List of user IDs who have read this message
  
  systemEvent?: {
    eventType: 'LEAD_ASSIGNED' | 'BOOKING_UPDATE' | 'PAYMENT_RECEIVED' | 'COMMISSION_PAYOUT' | 'SITE_VISIT' | 'APPROVAL_REQUEST' | 'ANNOUNCEMENT';
    entityId?: string;
    actionUrl?: string;
    metadata?: Record<string, unknown>;
  };
}

export interface ConversationParticipant {
  uid: string;
  displayName: string;
  role: UserRole;
  cadre?: CadreLevel;
  email?: string;
  photoURL?: string;
  department?: string;
  isOnline?: boolean;
}

export interface InternalConversation extends BaseEntity {
  title: string;
  type: 'DIRECT' | 'GROUP' | 'BROADCAST' | 'SYSTEM_ALERTS';
  channelCategory: ChannelCategory;
  participants: string[]; // User IDs
  participantProfiles?: ConversationParticipant[];
  
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    createdAt: string;
    priority?: MessagePriority;
    readBy: string[];
  };
  
  unreadCounts: Record<string, number>; // userId -> unread count
  pinnedFor?: string[];
  description?: string;
}

export interface SystemNotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'lead' | 'booking' | 'payment' | 'commission' | 'visit' | 'approval' | 'announcement' | 'system';
  severity: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  readAt?: string;
  createdAt: string;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}
