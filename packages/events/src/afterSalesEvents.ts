import { Event, AggregateType } from './types/event';
import { AfterSalesCase, CustomerNotification } from '@real-estate-erp/types';

export enum AfterSalesEventType {
  AFTER_SALES_CREATED = 'AFTER_SALES_CREATED',
  AFTER_SALES_UPDATED = 'AFTER_SALES_UPDATED',
  AFTER_SALES_RESOLVED = 'AFTER_SALES_RESOLVED',
}

export interface AfterSalesCreatedEvent extends Event<AfterSalesCase> {
  aggregateType: AggregateType.AfterSales;
  eventType: AfterSalesEventType.AFTER_SALES_CREATED;
}

export interface AfterSalesUpdatedEvent extends Event<AfterSalesCase> {
  aggregateType: AggregateType.AfterSales;
  eventType: AfterSalesEventType.AFTER_SALES_UPDATED;
}

export enum CustomerNotificationEventType {
  CUSTOMER_NOTIFICATION_CREATED = 'CUSTOMER_NOTIFICATION_CREATED',
  CUSTOMER_NOTIFICATION_PUBLISHED = 'CUSTOMER_NOTIFICATION_PUBLISHED',
}

export interface CustomerNotificationCreatedEvent extends Event<CustomerNotification> {
  aggregateType: AggregateType.CustomerNotification;
  eventType: CustomerNotificationEventType.CUSTOMER_NOTIFICATION_CREATED;
}
