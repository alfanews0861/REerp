export enum AggregateType {
  Lead = 'Lead',
  Person = 'Person',
  Interaction = 'Interaction',
  Workflow = 'Workflow',
  Booking = 'Booking',
  Payment = 'Payment',
  Customer = 'Customer',
  Vehicle = 'Vehicle',
  Campaign = 'Campaign',
  Attendance = 'Attendance',
  Expense = 'Expense',
  SiteVisit = 'SiteVisit',
  Notification = 'Notification',
  Plot = 'Plot',
  Network = 'Network',
  Commission = 'Commission',
  Document = 'Document',
  AfterSales = 'AfterSales',
  CustomerNotification = 'CustomerNotification',
}

export interface EventMetadata {
  correlationId?: string;
  sourceIp?: string;
  userAgent?: string;
  [key: string]: any;
}

export interface Event<T = any> {
  eventId: string;
  aggregateId: string;
  aggregateType: AggregateType;
  eventType: string;
  timestamp: string; // ISO 8601
  version: number;
  actor: string; // User ID or System
  payload: T;
  metadata: EventMetadata;
}
