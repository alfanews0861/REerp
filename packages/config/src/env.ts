import { z } from 'zod';

export const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase Auth Domain is required'),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase Project ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase Storage Bucket is required'),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase Messaging Sender ID is required'),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'Firebase App ID is required'),
  VITE_FIREBASE_VAPID_KEY: z.string().optional(),
  VITE_USE_FIREBASE_EMULATOR: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
  VITE_EMULATOR_HOST: z.string().optional().default('localhost'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(env: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
    throw new Error('Environment configuration validation failed');
  }
  return result.data;
}
