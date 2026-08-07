import { z } from 'zod';

export const baseFirestoreModelSchema = z.object({
  id: z.string().min(1),
  createdAt: z.string().datetime().or(z.string().min(1)),
  updatedAt: z.string().datetime().or(z.string().min(1)),
  createdBy: z.string().min(1),
  updatedBy: z.string().min(1),
  isActive: z.boolean(),
  isDeleted: z.boolean(),
  version: z.number().int().nonnegative(),
});

export const baseCreateInputSchema = z.object({
  id: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  createdBy: z.string().min(1),
  updatedBy: z.string().min(1),
  isActive: z.boolean().default(true),
  isDeleted: z.boolean().default(false),
  version: z.number().int().optional(),
});
