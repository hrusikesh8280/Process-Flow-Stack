import { z } from 'zod';
import 'dotenv/config';        

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  PORT: z.string().optional().default('3000'),
  NODE_ENV: z.string().optional().default('development'),
});

export const env = envSchema.parse(process.env);
