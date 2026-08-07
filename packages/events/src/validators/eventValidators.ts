import { z } from 'zod';
import { AggregateType } from '../types/event';

export const EventMetadataSchema = z.object({
  correlationId: z.string().optional(),
  sourceIp: z.string().optional(),
  userAgent: z.string().optional(),
}).catchall(z.any());

export const EventSchema = z.object({
  eventId: z.string().uuid(),
  aggregateId: z.string(),
  aggregateType: z.nativeEnum(AggregateType),
  eventType: z.string(),
  timestamp: z.string().datetime(),
  version: z.number().int().positive(),
  actor: z.string(),
  payload: z.any(),
  metadata: EventMetadataSchema,
});
