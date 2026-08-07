import { z } from 'zod';
import { EventSchema } from '../validators/eventValidators';
import { AggregateType, EventMetadata } from '../types/event';

export type EventDto<T = any> = z.infer<typeof EventSchema> & { payload: T };

export interface PublishEventDto<T = any> {
  aggregateId: string;
  aggregateType: AggregateType;
  eventType: string;
  actor: string;
  payload: T;
  metadata?: EventMetadata;
}
