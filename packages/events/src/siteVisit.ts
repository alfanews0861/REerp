export interface SiteVisitCreatedEvent {
  eventName: 'SITE_VISIT_CREATED';
  visitId: string;
  leadId?: string;
  assignedExecutiveId: string;
}

export interface SiteVisitStartedEvent {
  eventName: 'SITE_VISIT_STARTED';
  visitId: string;
  leadId?: string;
  assignedExecutiveId: string;
  checkInTime: string;
}

export interface SiteArrivedEvent {
  eventName: 'SITE_ARRIVED';
  visitId: string;
  leadId?: string;
  arrivalTime: string;
}

export interface SiteVisitCompletedEvent {
  eventName: 'SITE_VISIT_COMPLETED';
  visitId: string;
  leadId?: string;
  assignedExecutiveId: string;
  outcome?: string;
}

export interface SiteVisitCancelledEvent {
  eventName: 'SITE_VISIT_CANCELLED';
  visitId: string;
  leadId?: string;
  reason?: string;
}

export interface SiteVisitNoShowEvent {
  eventName: 'SITE_VISIT_NO_SHOW';
  visitId: string;
  leadId?: string;
}

export type SiteVisitEvent =
  | SiteVisitCreatedEvent
  | SiteVisitStartedEvent
  | SiteArrivedEvent
  | SiteVisitCompletedEvent
  | SiteVisitCancelledEvent
  | SiteVisitNoShowEvent;
