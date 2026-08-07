import { BaseEntity } from './common';

export type InteractionType = 
  | 'PHONE_CALL'
  | 'INCOMING_CALL'
  | 'OUTGOING_CALL'
  | 'WHATSAPP'
  | 'SMS'
  | 'EMAIL'
  | 'MEETING'
  | 'VIDEO_MEETING'
  | 'OFFICE_VISIT'
  | 'SITE_VISIT'
  | 'NOTE'
  | 'TASK'
  | 'REMINDER'
  | 'FOLLOW_UP'
  | 'DOCUMENT_SHARED'
  | 'QUOTATION_SHARED'
  | 'BROCHURE_SHARED';

export type CallResult = 
  | 'CONNECTED'
  | 'BUSY'
  | 'NO_ANSWER'
  | 'SWITCHED_OFF'
  | 'WRONG_NUMBER'
  | 'INTERESTED'
  | 'NOT_INTERESTED'
  | 'CALL_BACK';

export type InteractionStatus = 
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'PENDING';

export type InteractionPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type InteractionOutcome = 'SUCCESS' | 'NEUTRAL' | 'FAILURE' | 'ESCALATED' | 'REQUIRES_FOLLOW_UP';

export type AttachmentType = 'PHOTO' | 'VIDEO' | 'PDF' | 'VOICE_NOTE' | 'DOCUMENT';

export interface InteractionAttachment {
  type: AttachmentType;
  url: string;
  name: string;
  sizeBytes?: number;
}

export interface MeetingDetails {
  location?: string;
  gpsCoordinates?: { latitude: number; longitude: number };
  checkInTime?: string; // ISO date string
  checkOutTime?: string; // ISO date string
  participants: string[]; // Person IDs or Employee IDs
  minutes?: string;
}

export interface TaskDetails {
  assignedTo: string; // Employee ID
  dueDate: string; // ISO date string
  reminderTime?: string; // ISO date string
  completionPercentage?: number;
}

export interface ReminderDetails {
  pushNotification: boolean;
  sms: boolean;
  whatsappReady: boolean;
  emailReady: boolean;
}

export interface Interaction extends BaseEntity {
  personId: string;
  type: InteractionType;
  
  // Relations
  projectId?: string;
  employeeId?: string;
  branchId?: string;

  // Temporal
  date: string; // ISO date string for the interaction day
  time?: string; // time string or ISO time
  durationSeconds?: number;

  status: InteractionStatus;
  priority: InteractionPriority;
  outcome?: InteractionOutcome;
  
  callResult?: CallResult;

  // Notes
  notes?: string;

  // Next Steps
  nextAction?: string;
  nextFollowUpDate?: string; // ISO date string

  // Specialized Details
  attachments?: InteractionAttachment[];
  meetingDetails?: MeetingDetails;
  taskDetails?: TaskDetails;
  reminderDetails?: ReminderDetails;

  // Immutability
  isArchived: boolean;
}
